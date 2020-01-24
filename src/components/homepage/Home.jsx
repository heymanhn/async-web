import React from 'react';
import { useQuery } from 'react-apollo';
import { Redirect, navigate } from '@reach/router';

import localStateQuery from 'graphql/queries/localState';
import organizationQuery from 'graphql/queries/organization';
import { getLocalAppState } from 'utils/auth';

import LoggedOutHome from './LoggedOutHome';

const Home = () => {
  const { data: localStateData } = useQuery(localStateQuery);
  const { isLoggedIn, isOnboarding } = localStateData;
  const { organizationId } = getLocalAppState();
  const { loading, data } = useQuery(organizationQuery, {
    variables: { id: organizationId },
  });

  if (!localStateData) return null;
  if (loading) return null;
  if (!isLoggedIn) return <LoggedOutHome />;

  if (isOnboarding) {
    const path = organizationId ? `/organizations/${organizationId}/invites` : '/organizations';
    return <Redirect to={path} noThrow />;
  }

  const { defaultDocumentId } = data.organization;

  return navigate(`/d/${defaultDocumentId}`);
};

export default Home;
