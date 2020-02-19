import React from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import { Redirect } from '@reach/router';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import { clearLocalUser, clearLocalAppState } from 'utils/auth';
import { reset, track } from 'utils/analytics';

const Logout = () => {
  const client = useApolloClient();
  const { data } = useQuery(isLoggedInQuery);
  if (!data) return null;

  const handleLogout = async () => {
    await clearLocalUser();
    await clearLocalAppState();
    track('Logged out');
    reset();

    client.resetStore();
  };

  if (data.isLoggedIn) {
    handleLogout();
    return <div>Logging out...</div>;
  }

  return <Redirect to="/" noThrow />;
};

export default Logout;
