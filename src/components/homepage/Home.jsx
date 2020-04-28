import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Redirect } from '@reach/router';

import organizationQuery from 'graphql/queries/organization';
import localStateQuery from 'graphql/queries/localState';
import { getLocalAppState } from 'utils/auth';

import LandingPage from 'components/landing/LandingPage';

const Home = () => {
  const { data: localStateData } = useQuery(localStateQuery);
  const { isLoggedIn, isOnboarding } = localStateData;
  const { organizationId } = getLocalAppState();
  const { loading, data } = useQuery(organizationQuery, {
    variables: { id: organizationId },
    skip: !isLoggedIn,
  });

  if (!localStateData || loading) return null;
  if (!isLoggedIn) return <LandingPage />;

  if (isOnboarding) {
    const path = organizationId
      ? `/organizations/${organizationId}/invites`
      : '/organizations';
    return <Redirect to={path} noThrow />;
  }

  const { defaultWorkspaceId } = data.organization;
  const redirectUrl = defaultWorkspaceId
    ? `/workspaces/${defaultWorkspaceId}`
    : '/inbox';

  return <Redirect to={redirectUrl} noThrow />;
};

export default Home;
