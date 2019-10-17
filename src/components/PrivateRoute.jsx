/* eslint react/prop-types: 0 */

import React from 'react';
import { useQuery } from 'react-apollo';
import { Redirect } from '@reach/router';

import { getLocalAppState } from 'utils/auth';
import localStateQuery from 'graphql/queries/localState';

const PrivateRoute = ({ component: Component, location, ...props }) => {
  const { data } = useQuery(localStateQuery);
  const { organizationId } = getLocalAppState();

  if (!data) return null;
  const { isLoggedIn, isOnboarding } = data;

  if (isOnboarding) {
    const path = organizationId ? `/organizations/${organizationId}/invites` : '/organizations';
    return <Redirect to={path} noThrow />;
  }

  if (!isLoggedIn && location.pathname !== '/') return <Redirect to="/" noThrow />;

  return <Component location={location} {...props} />;
};

export default PrivateRoute;
