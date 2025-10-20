'use client';

import { useSession } from '@/lib/auth-client';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // 'super_admin', 'regional_admin', etc.
  regionScope?: string; // For regional admins
}

// Separate component to handle role-based access control
function RoleProtectedWrapper({ 
  children, 
  requiredRole, 
  regionScope,
  session
}: { 
  children: React.ReactNode; 
  requiredRole: string; 
  regionScope?: string;
  session: {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
    };
    session: {
      id: string;
    };
  };
}) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if user has required role
          let accessGranted = true;
          if (requiredRole) {
            accessGranted = data.user?.role === requiredRole;
          }
          
          // Check if user has required region scope
          if (regionScope && data.user?.regionCode) {
            accessGranted = accessGranted && data.user.regionCode === regionScope;
          }
          
          setHasAccess(accessGranted);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUserRole();
    }
  }, [session, requiredRole, regionScope]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Akses Ditolak</h2>
          <p className="text-muted-foreground mt-2">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  regionScope 
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      // Redirect to login if not authenticated
      router.push('/sign-in');
    }
  }, [session, isPending, router]);

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated but doesn't have required role
  if (session && requiredRole) {
    // Need to fetch the user's role from the API since Better Auth doesn't include role in the session by default
    // For now, we'll fetch role info in a useEffect to avoid blocking the render
    return (
      <RoleProtectedWrapper 
        requiredRole={requiredRole} 
        regionScope={regionScope}
        session={session}
      >
        {children}
      </RoleProtectedWrapper>
    );
  }

  // If session exists and no role check required, render children
  if (session) {
    return <>{children}</>;
  }

  // If no session, return null (the redirect happens in useEffect)
  return null;
}