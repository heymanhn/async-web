import React from 'react';
import { useQuery } from 'react-apollo';
import { Redirect } from '@reach/router';

import localStateQuery from 'graphql/queries/localState';
import { getLocalAppState } from 'utils/auth';

import LoggedOutHome from './LoggedOutHome';

const Home = () => {
  const { data: localStateData } = useQuery(localStateQuery);

  if (!localStateData) return null;
  const { isLoggedIn, isOnboarding } = localStateData;
  const { organizationId } = getLocalAppState();

  if (!isLoggedIn) return <LoggedOutHome />;

  if (isOnboarding) {
    const path = organizationId ? `/organizations/${organizationId}/invites` : '/organizations';
    return <Redirect to={path} noThrow />;
  }

  return <div>Hi, you are logged in</div>;
};

export default Home;
