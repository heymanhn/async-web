import { useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

const TIMEOUT = 10000;
const useNetworkObserver = () => {
  const client = useApolloClient();
  const lastTimeRef = useRef(Date.now());
  lastTimeRef.current = Date.now();

  useEffect(() => {
    const handleRefetch = () => {
      client.reFetchObservableQueries();
    };

    // Inspired by: https://blog.alexmaccaw.com/javascript-wake-event
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime > lastTimeRef.current + TIMEOUT + 2000) {
        handleRefetch();
      }

      lastTimeRef.current = currentTime;
    }, TIMEOUT);

    window.addEventListener('online', handleRefetch);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleRefetch);
    };
  }, [client]);
};

export default useNetworkObserver;
