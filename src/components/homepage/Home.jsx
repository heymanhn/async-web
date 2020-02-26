import React from 'react';
import { useQuery } from 'react-apollo';
import { Redirect } from '@reach/router';

import localStateQuery from 'graphql/queries/localState';
import { getLocalAppState } from 'utils/auth';

import LandingPage from 'components/landing/LandingPage';

const Home = () => {
  const { data: localStateData } = useQuery(localStateQuery);
  const { isLoggedIn, isOnboarding } = localStateData;
  const { organizationId } = getLocalAppState();

  if (!localStateData) return null;
  if (!isLoggedIn) return <LandingPage />;

  if (isOnboarding) {
    const path = organizationId
      ? `/organizations/${organizationId}/invites`
      : '/organizations';
    return <Redirect to={path} noThrow />;
  }

  return <Redirect to="/inbox" noThrow />;
};

export default Home;
