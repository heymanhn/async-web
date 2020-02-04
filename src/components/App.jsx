/* eslint react/prop-types: 0 */
/* eslint camelcase: 0 */

import React from 'react';
import { Router } from '@reach/router';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { RestLink } from 'apollo-link-rest';
import { ApolloLink, concat } from 'apollo-link';
import camelCase from 'camelcase';
import snake_case from 'snake-case';

import {
  getAuthHeader,
  isLocalTokenPresent,
  isUserOnboarding,
} from 'utils/auth';
import fileSerializer from 'utils/graphql/fileSerializer';
import localResolvers from 'utils/graphql/localResolvers';
import getBreakpoint from 'utils/mediaQuery';
import usePusher from 'utils/hooks/usePusher';

import Layout from 'components/Layout';
import Home from 'components/homepage/Home';
import Login from 'components/auth/Login';
import DemoLogin from 'components/auth/DemoLogin';
import Logout from 'components/Logout';
import NotFound from 'components/navigation/NotFound';
import SignUp from 'components/auth/SignUp';
import CreateOrganization from 'components/auth/CreateOrganization';
import InviteTeam from 'components/auth/InviteTeam';
import PrivateRoute from 'components/PrivateRoute';
import DocumentContainer from 'components/document/DocumentContainer';
import DiscussionLinkHandler from 'components/discussion/DiscussionLinkHandler';
import DiscussionContainer from './discussion/DiscussionContainer';

const restLink = new RestLink({
  uri: process.env.REACT_APP_ASYNC_API_URL,
  credentials: 'same-origin',
  fieldNameNormalizer: key => camelCase(key),
  fieldNameDenormalizer: key => snake_case(key),
  headers: {
    'Content-Type': 'application/json',
  },
  bodySerializers: {
    file: fileSerializer,
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: { authorization: getAuthHeader() || null },
  });

  return forward(operation);
});

/*
 * Since we're initializing local state with direct writes to the cache, we need to pass
 * an empty resolvers object to Apollo Client upon instantiation. Reference:
 *
 * https://github.com/apollographql/apollo-client/pull/4499
 */
const cache = new InMemoryCache();

// TODO: Monkey-patching in a fix for an open issue suggesting that
// `readQuery` should return null or undefined if the query is not yet in the
// cache: https://github.com/apollographql/apollo-feature-requests/issues/1
cache.originalReadQuery = cache.readQuery;
cache.readQuery = (...args) => {
  try {
    return cache.originalReadQuery(...args);
  } catch (err) {
    return undefined;
  }
};

const client = new ApolloClient({
  link: concat(authMiddleware, restLink),
  cache,
  resolvers: localResolvers,
});

// Initialize the local graphql cache
const generateDefaultData = () => ({
  isLoggedIn: isLocalTokenPresent(),
  isOnboarding: isUserOnboarding(),
  mediaBreakpoint: getBreakpoint(),
  pendingMessages: [],
  selectedMeetingId: null,
});
cache.writeData({ data: generateDefaultData() });
client.onResetStore(() =>
  Promise.resolve(cache.writeData({ data: generateDefaultData() }))
);

// TEMP: set client as a global variable for non-React usages
window.Roval = { apolloClient: client };

const App = () => {
  usePusher();

  return (
    <Layout>
      <Router>
        <Home path="/" />
        <SignUp path="/invites/:inviteCode" />
        <CreateOrganization path="/organizations" />
        <InviteTeam path="/organizations/:organizationId/invites" />
        <Login path="/login" />
        <DemoLogin path="/demo/login" />
        <Logout path="/logout" />

        <PrivateRoute path="/d/:documentId" component={DocumentContainer} />
        <PrivateRoute
          path="/d/:documentId/discussions/:discussionId"
          component={DocumentContainer}
        />
        <PrivateRoute
          path="/d/:documentId/discussions"
          component={DocumentContainer}
          viewMode="discussions"
        />
        <PrivateRoute
          path="/discussions/:discussionId"
          component={DiscussionContainer}
        />

        <NotFound path="/notfound" default />
      </Router>
    </Layout>
  );
};

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default ApolloApp;
