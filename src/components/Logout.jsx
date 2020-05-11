import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from '@reach/router';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import useLogout from 'hooks/shared/useLogout';

const Logout = () => {
  const logout = useLogout();
  const {
    data: { isLoggedIn },
  } = useQuery(isLoggedInQuery);

  useEffect(() => {
    const handleLogout = async () => {
      if (isLoggedIn) {
        await logout();
        window.location.replace('/');
      }
    };

    handleLogout();
  }, [isLoggedIn, logout]);

  if (!isLoggedIn) return <Redirect to="/" noThrow />;

  return null;
};

export default Logout;
