/* eslint react/prop-types: 0 */

import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from '@reach/router';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';

const PrivateRoute = ({ component: Component, location, ...rest }) => (
  <Query query={isLoggedInQuery}>
    {({ data }) => {
      if (!data.isLoggedIn && location.pathname !== '/') {
        return <Redirect to="/" noThrow />;
      }

      return <Component location={location} {...rest} />;
    }}
  </Query>
);

export default PrivateRoute;
