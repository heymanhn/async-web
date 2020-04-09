import { useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

const TIMEOUT = 10000;
const useNetworkObserver = () => {
  const client = useApolloClient();
  const lastTimeRef = useRef(Date.now());
  lastTimeRef.current = Date.now();

  useEffect(() => {
    // Inspired by: https://blog.alexmaccaw.com/javascript-wake-event
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime > lastTimeRef.current + TIMEOUT + 2000)
        console.log('wake up!!');

      lastTimeRef.current = currentTime;
    }, TIMEOUT);

    const handleOnline = () => {
      console.log('Back online!');
    };

    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, [client]);
};

export default useNetworkObserver;
