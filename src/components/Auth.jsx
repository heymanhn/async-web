import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from 'react-apollo';
import { navigate, Redirect } from '@reach/router';

import {
  setLocalUser,
  clearLocalUser,
} from 'utils/auth';
import { parseQueryString } from 'utils/queryParams';
import fakeAuthQuery from 'graphql/queries/fakeAuth'; // Temporary, for the prototype
import isLoggedInQuery from 'graphql/queries/isLoggedIn';

const Auth = ({ location }) => {
  const client = useApolloClient();
  const { data } = useQuery(isLoggedInQuery);

  async function handleLogin(code) {
    try {
      const { data: fakeAuthData } = await client.query({
        query: fakeAuthQuery,
        variables: { code },
      });

      if (fakeAuthData && fakeAuthData.user) {
        const {
          id: userId,
          fullName: name,
          email,
          token: userToken,
          organizationId,
        } = fakeAuthData.user;

        setLocalUser({ userId, userToken, organizationId });
        window.analytics.identify(userId, { name, email });
        client.writeData({ data: { isLoggedIn: true } });
      } else {
        Promise.reject(new Error('Failed to log in'));
      }
    } catch (err) {
      clearLocalUser();
      client.resetStore();
      navigate('/', { replace: true });
    }
  }

  if (data) {
    if (data.isLoggedIn) return <Redirect to="/" noThrow />;

    const params = parseQueryString(location.search);
    if (!params || !params.code) return <div>Cannot log in</div>;

    handleLogin(params.code);
  }

  return <div>Logging in...</div>;
};

Auth.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Auth;
