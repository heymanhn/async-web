/* eslint react/prop-types: 0 */

import React from 'react';
import { useQuery } from 'react-apollo';
import { Redirect } from '@reach/router';

import localStateQuery from 'graphql/queries/localState';

const PrivateRoute = ({ component: Component, location, ...props }) => {
  const { data } = useQuery(localStateQuery);

  if (!data) return null;
  if (!data.isLoggedIn && location.pathname !== '/') {
    return <Redirect to="/" noThrow />;
  }

  return <Component location={location} {...props} />;
};

export default PrivateRoute;
