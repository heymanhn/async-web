import React from 'react';
import { useApolloClient } from 'react-apollo';
import { Redirect } from '@reach/router';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import localStateQuery from 'graphql/queries/localState';
import meetingsQuery from 'graphql/queries/meetings';
import withPageTracking from 'utils/withPageTracking';

const Container = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '50px 20px',
}));

const Home = () => {
  const client = useApolloClient();
  const { isLoggedIn } = client.readQuery({ query: localStateQuery });
  const [getMeetings, { data }] = useLazyQuery(meetingsQuery);

  if (!isLoggedIn) {
    return (
      <Container>
        <div>Hello. It&rsquo;s an asynchronous world.</div>
      </Container>
    );
  }

  if (!data) {
    getMeetings();
    return null;
  }

  if (data && data.meetings) {
    // Assumes that an organization has at least one meeting space
    const { items } = data.meetings;
    const meetings = (items || []).map(i => i.meeting);
    const targetId = meetings[0].id;

    return <Redirect to={`/spaces/${targetId}`} noThrow />;
  }

  return null;
};

export default withPageTracking(Home, 'Logged Out Home');
