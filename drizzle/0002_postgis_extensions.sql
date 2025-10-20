-- Migration: Add PostGIS extensions and spatial columns
-- This migration adds PostGIS support for the parks table

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add geometry columns to parks table
ALTER TABLE parks
ADD COLUMN geom geometry(MultiPolygon, 4326),
ADD COLUMN centroid geometry(Point, 4326);

-- Create spatial indexes for performance
CREATE INDEX IF NOT EXISTS idx_parks_geom ON parks USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_parks_centroid ON parks USING GIST (centroid);
CREATE INDEX IF NOT EXISTS idx_parks_province_geom ON parks (province, geom);

-- Add trigger to automatically calculate centroid from geometry
CREATE OR REPLACE FUNCTION update_park_centroid()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.geom IS NOT NULL THEN
    NEW.centroid = ST_Centroid(NEW.geom);
    -- Update lat/lng fields for backward compatibility
    NEW.centroidLat = ST_Y(NEW.centroid);
    NEW.centroidLng = ST_X(NEW.centroid);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update centroid
CREATE TRIGGER trg_update_park_centroid
  BEFORE INSERT OR UPDATE ON parks
  FOR EACH ROW
  EXECUTE FUNCTION update_park_centroid();

-- Function to calculate biodiversity index for a park
CREATE OR REPLACE FUNCTION calculate_park_biodiversity_score(park_id UUID)
RETURNS INTEGER AS $$
DECLARE
  flora_score INTEGER;
  fauna_score INTEGER;
  ecosystem_score INTEGER;
  total_score INTEGER;
BEGIN
  -- Calculate flora diversity score (simplified)
  SELECT
    CASE
      WHEN COUNT(*) = 0 THEN 0
      WHEN COUNT(*) < 10 THEN 25
      WHEN COUNT(*) < 50 THEN 50
      WHEN COUNT(*) < 100 THEN 75
      ELSE 100
    END
  INTO flora_score
  FROM flora
  WHERE park_id = calculate_park_biodiversity_score.park_id
    AND status = 'APPROVED';

  -- Calculate fauna diversity score
  SELECT
    CASE
      WHEN COUNT(*) = 0 THEN 0
      WHEN COUNT(*) < 10 THEN 25
      WHEN COUNT(*) < 50 THEN 50
      WHEN COUNT(*) < 100 THEN 75
      ELSE 100
    END
  INTO fauna_score
  FROM fauna
  WHERE park_id = calculate_park_biodiversity_score.park_id
    AND status = 'APPROVED';

  -- Calculate ecosystem score (based on area)
  SELECT
    CASE
      WHEN area_ha < 1000 THEN 25
      WHEN area_ha < 10000 THEN 50
      WHEN area_ha < 50000 THEN 75
      ELSE 100
    END
  INTO ecosystem_score
  FROM parks
  WHERE id = calculate_park_biodiversity_score.park_id;

  -- Calculate total score (weighted average)
  total_score = ROUND((flora_score * 0.4 + fauna_score * 0.4 + ecosystem_score * 0.2));

  -- Update the park with the calculated score
  UPDATE parks
  SET biodiversity_score = total_score,
      updated_at = NOW()
  WHERE id = calculate_park_biodiversity_score.park_id;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Function to get parks within bounding box
CREATE OR REPLACE FUNCTION get_parks_in_bbox(
  min_lng NUMERIC,
  min_lat NUMERIC,
  max_lng NUMERIC,
  max_lat NUMERIC,
  filter_status TEXT DEFAULT 'APPROVED'
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  province TEXT,
  biodiversity_score INTEGER,
  geom GEOMETRY
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.official_name as name,
    p.province,
    p.biodiversity_score,
    p.geom
  FROM parks p
  WHERE p.status = filter_status
    AND p.geom IS NOT NULL
    AND p.geom && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
  ORDER BY p.biodiversity_score DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby parks within radius
CREATE OR REPLACE FUNCTION get_nearby_parks(
  center_lng NUMERIC,
  center_lat NUMERIC,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  distance_km NUMERIC,
  biodiversity_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.official_name as name,
    ST_Distance(
      p.centroid::geography,
      ST_MakePoint(center_lng, center_lat)::geography
    ) / 1000 as distance_km,
    p.biodiversity_score
  FROM parks p
  WHERE p.status = 'APPROVED'
    AND p.centroid IS NOT NULL
    AND ST_DWithin(
      p.centroid::geography,
      ST_MakePoint(center_lng, center_lat)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Function to update content counts for parks
CREATE OR REPLACE FUNCTION update_park_content_counts(park_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Update flora count
  UPDATE parks
  SET total_flora = (
    SELECT COUNT(*)
    FROM flora
    WHERE park_id = update_park_content_counts.park_id
      AND status = 'APPROVED'
  )
  WHERE id = update_park_content_counts.park_id;

  -- Update fauna count
  UPDATE parks
  SET total_fauna = (
    SELECT COUNT(*)
    FROM fauna
    WHERE park_id = update_park_content_counts.park_id
      AND status = 'APPROVED'
  )
  WHERE id = update_park_content_counts.park_id;

  -- Update activities count (assuming activities table exists)
  UPDATE parks
  SET total_activities = COALESCE((
    SELECT COUNT(*)
    FROM activities
    WHERE park_id = update_park_content_counts.park_id
      AND status = 'APPROVED'
  ), 0)
  WHERE id = update_park_content_counts.park_id;

  -- Trigger biodiversity score recalculation
  PERFORM calculate_park_biodiversity_score(park_id);
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_parks_status ON parks(status);
CREATE INDEX IF NOT EXISTS idx_parks_province ON parks(province);
CREATE INDEX IF NOT EXISTS idx_parks_biodiversity_score ON parks(biodiversity_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_parks_created_at ON parks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parks_is_active ON parks(is_active) WHERE is_active = true;

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_parks_search ON parks USING gin(
  to_tsvector('indonesian',
    COALESCE(official_name, '') || ' ' ||
    COALESCE(province, '') || ' ' ||
    COALESCE(description, '')
  )
);

-- Insert initial sample data for testing (optional)
-- This will be handled by seed script instead