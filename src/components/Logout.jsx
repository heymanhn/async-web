/* eslint react-hooks/exhaustive-deps: 0 */
import React, { useEffect } from 'react';
import { useApolloClient } from 'react-apollo';
import { navigate } from '@reach/router';

import { clearLocalUser } from 'utils/auth';

const Logout = () => {
  const client = useApolloClient();

  useEffect(() => {
    async function handleLogout() {
      await clearLocalUser();
      await client.resetStore();
      navigate('/');
    }

    handleLogout();
  }, []);

  return (
    <div>Logging out...</div>
  );
};

export default Logout;
