import React from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import { Redirect } from '@reach/router';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import { clearLocalUser } from 'utils/auth';

const Logout = () => {
  const client = useApolloClient();
  const { data } = useQuery(isLoggedInQuery);
  if (!data) return null;

  async function handleLogout() {
    await clearLocalUser();
    client.resetStore();
  }

  if (data.isLoggedIn) {
    handleLogout();
    return <div>Logging out...</div>;
  }

  return <Redirect to="/" noThrow />;
};

export default Logout;
