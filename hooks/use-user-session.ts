import { useSession, getSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

// Custom hook to get user session with role information
export const useUserSession = () => {
  const { data: session, isPending: sessionLoading, ...rest } = useSession();
  
  const [userWithRole, setUserWithRole] = useState<any>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            setUserWithRole(data.user);
          } else {
            // If API fails, use original session data
            setUserWithRole(session.user);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          // Use original session data on error
          setUserWithRole(session.user);
        } finally {
          setIsLoadingRole(false);
        }
      } else {
        setIsLoadingRole(false);
        setUserWithRole(null);
      }
    };

    fetchUserRole();
  }, [session?.user]);

  // Return session data with role information
  return {
    ...rest,
    data: {
      ...session,
      user: userWithRole,
    },
    isLoading: sessionLoading || isLoadingRole,
  };
};