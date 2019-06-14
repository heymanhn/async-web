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

import { getAuthHeader, isLocalTokenPresent } from 'utils/auth';
import getBreakpoint from 'utils/mediaQuery';

import Layout from 'components/Layout';
import Home from 'components/homepage/Home';

const restLink = new RestLink({
  uri: process.env.REACT_APP_ASYNC_API_URL,
  credentials: 'same-origin',
  fieldNameNormalizer: (key => camelCase(key)),
  fieldNameDenormalizer: (key => snake_case(key)),
  headers: {
    'Content-Type': 'application/json',
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
const client = new ApolloClient({
  link: concat(authMiddleware, restLink),
  cache,
  resolvers: {},
});

// Initialize the local graphql cache
const generateDefaultData = () => ({
  isLoggedIn: isLocalTokenPresent(),
  mediaBreakpoint: getBreakpoint(),
});
cache.writeData({ data: generateDefaultData() });
client.onResetStore(() => cache.writeData({ data: generateDefaultData() }));

const App = () => (
  <Layout>
    {/* Setting primary prop to `false` per: */}
    {/* https://stackoverflow.com/questions/53058110/stop-reach-router-scrolling-down-the-page-after-navigating-to-new-page */}
    <Router primary={false}>
      <Home path="/" />

      {/* <Invite path="/c/:hash" />
      <PrivateRoute path="/onboarding" component={Onboarding} />
      <PrivateRoute path="/search" component={Search} />
      <PrivateRoute path="/people/:id" component={Person} />
      <PrivateRoute path="/organizations/:id" component={Organization} />
      <PrivateRoute path="/connections" component={Connections} />
      <PrivateRoute path="/preferences" component={Preferences} /> */}

      {/* Legal pages */}
      {/* <MarkdownTemplate path="/privacy" file={PrivacyPolicy} />
      <MarkdownTemplate path="/terms" file={TermsOfUse} /> */}

      {/* <NotFound default /> */}
    </Router>
  </Layout>
);

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default ApolloApp;
