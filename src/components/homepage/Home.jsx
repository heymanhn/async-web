import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from '@reach/router';
import styled from '@emotion/styled';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import withPageTracking from 'utils/withPageTracking';

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
        <Container>
          <div>Hello. It&rsquo;s an asynchronous world.</div>
        </Container>
      );
    }}
  </Query>
);

export default withPageTracking(Home, 'Logged Out Home');
