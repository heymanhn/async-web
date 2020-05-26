import { useEffect, useRef } from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import currentUserQuery from 'graphql/queries/currentUser';
import localStateQuery from 'graphql/queries/localState';
import { getLocalUser } from 'utils/auth';

const TIMEOUT = 60000;
const useNetworkObserver = () => {
  const client = useApolloClient();
  const lastTimeRef = useRef(Date.now());
  lastTimeRef.current = Date.now();

  const { userId } = getLocalUser();
  const { refetch: getCurrentUser } = useQuery(currentUserQuery, {
    variables: { userId },
    skip: true,
  });

  const {
    data: { isLoggedIn },
  } = useQuery(localStateQuery);

  useEffect(() => {
    if (!isLoggedIn) return () => {};

    const handleRefetch = async (waitInterval = TIMEOUT) => {
      console.log('Network observer: Refetching queries');
      try {
        await getCurrentUser(); // Refetch one query to test the waters first
        await client.reFetchObservableQueries();
      } catch (err) {
        setTimeout(() => handleRefetch(waitInterval * 2), waitInterval);
      }
    };

    // Inspired by: https://blog.alexmaccaw.com/javascript-wake-event
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime > lastTimeRef.current + TIMEOUT + 2000) {
        console.log('Network observer: triggering a refresh');
        handleRefetch();
      }

      lastTimeRef.current = currentTime;
    }, TIMEOUT);

    window.addEventListener('online', handleRefetch);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleRefetch);
    };
  }, [client, isLoggedIn, getCurrentUser]);
};

export default useNetworkObserver;
