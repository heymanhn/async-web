import React from 'react';
import { useApolloClient } from 'react-apollo';
import { navigate } from '@reach/router';

import { getLocalUser, clearLocalUser } from 'utils/auth';

const Logout = () => {
  const client = useApolloClient();
  const { userId } = getLocalUser();

  async function handleLogout() {
    await clearLocalUser();
    await client.resetStore();
    navigate('/', { replace: true });
  }

  if (userId) handleLogout();

  return (
    <div>Logging out...</div>
  );
};

export default Logout;
