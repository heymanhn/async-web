import React from 'react';
import { useQuery } from 'react-apollo';
import { navigate, Redirect } from '@reach/router';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import localStateQuery from 'graphql/queries/localState';
import meetingsQuery from 'graphql/queries/meetings';
import { getLocalAppState } from 'utils/auth';

import LoggedOutHome from './LoggedOutHome';

const Home = () => {
  const { data: localStateData } = useQuery(localStateQuery);
  const [getMeetings, { data }] = useLazyQuery(meetingsQuery);

  if (!localStateData) return null;
  const { isLoggedIn, isOnboarding } = localStateData;
  const { organizationId } = getLocalAppState();

  if (!isLoggedIn) return <LoggedOutHome />;

  if (isOnboarding) {
    const path = organizationId ? `/organizations/${organizationId}/invites` : '/organizations';
    return <Redirect to={path} noThrow />;
  }

  if (!data) {
    getMeetings();
    return null;
  }

  if (data && data.meetings) {
    // Assumes that an organization has at least one meeting space
    const { items } = data.meetings;
    const meetings = (items || []).map(i => i.meeting);

    if (meetings.length) {
      const targetId = meetings[0].id;

      navigate(`/spaces/${targetId}`, { replace: true });
    } else {
      return <div>You are logged in</div>;
    }
  }

  return null;
};

export default Home;
