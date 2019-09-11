import React from 'react';
import { useQuery } from 'react-apollo';
import { navigate } from '@reach/router';
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
  const { data: localStateData } = useQuery(localStateQuery);
  const [getMeetings, { data }] = useLazyQuery(meetingsQuery);

  if (!localStateData) return null;
  if (localStateData && !localStateData.isLoggedIn) {
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

    navigate(`/spaces/${targetId}`, { replace: true });
  }

  return null;
};

export default withPageTracking(Home, 'Logged Out Home');
