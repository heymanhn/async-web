import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from 'react-apollo';
import { navigate, Redirect } from '@reach/router';

import {
  setLocalUser,
  clearLocalUser,
  clearLocalAppState,
  setLocalAppState,
} from 'utils/auth';
import { identify, track } from 'utils/analytics';
import { parseQueryString } from 'utils/queryParams';
import demoAuthQuery from 'graphql/queries/demoLogin'; // Temporary, for the prototype
import isLoggedInQuery from 'graphql/queries/isLoggedIn';

const DemoLogin = ({ location }) => {
  const client = useApolloClient();
  const { data } = useQuery(isLoggedInQuery);

  async function handleLogin(code) {
    try {
      const { data: demoAuthData } = await client.query({
        query: demoAuthQuery,
        variables: { code },
      });

      if (demoAuthData && demoAuthData.user) {
        const {
          id: userId,
          fullName,
          email,
          token: userToken,
          organizationId,
        } = demoAuthData.user;

        setLocalUser({ userId, userToken });
        setLocalAppState({ organizationId });

        identify(userId, { fullName, email });
        track('Demo Logged in');
        client.writeData({ data: { isLoggedIn: true } });
      } else {
        Promise.reject(new Error('Failed to log in'));
      }
    } catch (err) {
      clearLocalUser();
      clearLocalAppState();
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

// NOTE: For some reason, Reach Router doesn't pass the location object to the Login component
// when the app is first loaded. Setting the prop to optional for now.
DemoLogin.propTypes = {
  location: PropTypes.object,
};

DemoLogin.defaultProps = {
  location: null,
};

export default DemoLogin;
