import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const useRouteGuard = () => {
  const { keycloak } = useKeycloak();
  const backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

  const [isLoading, setIsLoading] = useState(true);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // Check if keycloak and keycloak.token are available
      if (!keycloak || !keycloak.authenticated || !keycloak.token) {
        setCanProceed(false);
        setIsLoading(false);
        return;
      }

      const accessToken = keycloak.token;

      try {
        const response = await fetch(`${backend}/misc/tableCount`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Table count:', data.tableCount);
          setCanProceed(data.tableCount > 0);
        } else {
          console.error('Failed to fetch table count:', response.statusText);
          setCanProceed(false);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setCanProceed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [backend, keycloak]);

  return { isLoading, canProceed };
};

export default useRouteGuard;
