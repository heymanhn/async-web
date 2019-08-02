import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from '@reach/router';
import styled from '@emotion/styled';

import isLoggedInQuery from 'graphql/isLoggedInQuery';
import withPageTracking from 'utils/withPageTracking';

import Layout from 'components/Layout';

const Container = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '50px 20px',
}));

const Home = () => (
  <Query query={isLoggedInQuery}>
    {({ data }) => {
      if (data.isLoggedIn) return <Redirect to="/inbox" noThrow />;

      return (
        <Layout>
          <Container>
            <div>Hello. It&rsquo;s an asynchronous world.</div>
          </Container>
        </Layout>
      );
    }}
  </Query>
);

export default withPageTracking(Home, 'Logged Out Home');
