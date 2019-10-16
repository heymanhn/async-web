import React from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import { navigate } from '@reach/router';
import Button from 'components/shared/Button';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import { clearLocalUser } from 'utils/auth';

const Logout = () => {
  const client = useApolloClient();
  const { data } = useQuery(isLoggedInQuery);
  if (!data) return null;

  async function handleLogout() {
    await clearLocalUser();
    client.resetStore();
    navigate('/');
  }

  return (
    <Button onClick={handleLogout} title="Sign out" />
  );
};

export default Logout;
