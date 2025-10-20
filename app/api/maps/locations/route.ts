import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { parks, flora, fauna } from '@/db/schema';
import { eq, ilike, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const types = searchParams.get('types')?.split(',') || [];
    const regions = searchParams.get('regions')?.split(',') || [];
    const search = searchParams.get('search');
    const conservationStatus = searchParams.get('conservationStatus');
    const minBiodiversity = parseInt(searchParams.get('minBiodiversity') || '0');
    const maxBiodiversity = parseInt(searchParams.get('maxBiodiversity') || '100');
    const bounds = searchParams.get('bounds'); // lat,lng,lat,lng format

    const locations = [];

    // Get parks
    if (!types.length || types.includes('park')) {
      const parkConditions = [];

      if (search) {
        parkConditions.push(
          ilike(parks.name, `%${search}%`)
        );
      }

      if (regions.length) {
        parkConditions.push(
          sql`${parks.region} = ANY(${regions})`
        );
      }

      if (conservationStatus) {
        parkConditions.push(
          eq(parks.conservationStatus, conservationStatus.toUpperCase())
        );
      }

      const parksData = await db
        .select({
          id: parks.id,
          name: parks.name,
          type: sql<string`'park'`,
          coordinates: parks.coordinates,
          description: parks.description,
          region: parks.region,
          conservationStatus: parks.conservationStatus,
          areaSize: parks.areaSize,
          elevation: parks.elevation,
          establishedDate: parks.establishedDate,
          biodiversityIndex: parks.biodiversityIndex,
        })
        .from(parks)
        .where(and(...parkConditions));

      locations.push(...parksData);
    }

    // Get flora
    if (!types.length || types.includes('flora')) {
      const floraConditions = [];

      if (search) {
        floraConditions.push(
          ilike(flora.scientificName, `%${search}%`)
        );
      }

      if (regions.length) {
        floraConditions.push(
          sql`${flora.region} = ANY(${regions})`
        );
      }

      if (conservationStatus) {
        floraConditions.push(
          eq(flora.conservationStatus, conservationStatus.toUpperCase())
        );
      }

      const floraData = await db
        .select({
          id: flora.id,
          name: flora.scientificName,
          type: sql<string`'flora'`,
          coordinates: flora.coordinates,
          description: flora.description,
          region: flora.region,
          conservationStatus: flora.conservationStatus,
          family: flora.family,
          localName: flora.localName,
        })
        .from(flora)
        .where(and(...floraConditions));

      locations.push(...floraData);
    }

    // Get fauna
    if (!types.length || types.includes('fauna')) {
      const faunaConditions = [];

      if (search) {
        faunaConditions.push(
          ilike(fauna.scientificName, `%${search}%`)
        );
      }

      if (regions.length) {
        faunaConditions.push(
          sql`${fauna.region} = ANY(${regions})`
        );
      }

      if (conservationStatus) {
        faunaConditions.push(
          eq(fauna.conservationStatus, conservationStatus.toUpperCase())
        );
      }

      const faunaData = await db
        .select({
          id: fauna.id,
          name: fauna.scientificName,
          type: sql<string`'fauna'`,
          coordinates: fauna.coordinates,
          description: fauna.description,
          region: fauna.region,
          conservationStatus: fauna.conservationStatus,
          family: fauna.family,
          localName: fauna.localName,
          population: fauna.population,
        })
        .from(fauna)
        .where(and(...faunaConditions));

      locations.push(...faunaData);
    }

    // Filter by biodiversity index if specified
    let filteredLocations = locations;
    if (minBiodiversity > 0 || maxBiodiversity < 100) {
      filteredLocations = locations.filter(location => {
        if (!location.biodiversityIndex) return true;
        return location.biodiversityIndex >= minBiodiversity &&
               location.biodiversityIndex <= maxBiodiversity;
      });
    }

    // Filter by map bounds if specified
    if (bounds) {
      const [minLat, minLng, maxLat, maxLng] = bounds.split(',').map(Number);
      filteredLocations = filteredLocations.filter(location => {
        if (!location.coordinates) return false;
        const [lat, lng] = location.coordinates;
        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
      });
    }

    // Transform data for frontend
    const transformedLocations = filteredLocations.map(location => ({
      ...location,
      coordinates: Array.isArray(location.coordinates)
        ? location.coordinates
        : [location.coordinates?.y, location.coordinates?.x].filter(Boolean),
      lastUpdated: new Date(),
      species: location.type === 'park' ? [] : [location.name],
    }));

    return NextResponse.json({
      locations: transformedLocations,
      total: transformedLocations.length,
    });
  } catch (error) {
    console.error('Error fetching map locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch map locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, coordinates, name, description, ...otherData } = body;

    // Validate required fields
    if (!type || !coordinates || !name) {
      return NextResponse.json(
        { error: 'Type, coordinates, and name are required' },
        { status: 400 }
      );
    }

    let newLocation;

    switch (type) {
      case 'park':
        [newLocation] = await db
          .insert(parks)
          .values({
            id: crypto.randomUUID(),
            name,
            coordinates,
            description,
            ...otherData,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        break;

      case 'flora':
        [newLocation] = await db
          .insert(flora)
          .values({
            id: crypto.randomUUID(),
            scientificName: name,
            coordinates,
            description,
            ...otherData,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        break;

      case 'fauna':
        [newLocation] = await db
          .insert(fauna)
          .values({
            id: crypto.randomUUID(),
            scientificName: name,
            coordinates,
            description,
            ...otherData,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid location type' },
          { status: 400 }
        );
    }

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}