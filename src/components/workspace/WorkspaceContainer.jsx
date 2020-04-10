import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { DEFAULT_WORKSPACE_CONTEXT, WorkspaceContext } from 'utils/contexts';
import { matchCurrentUserId } from 'utils/auth';
import useViewedReaction from 'utils/hooks/useViewedReaction';
import useUpdateSelectedResource from 'utils/hooks/useUpdateSelectedResource';

import NavigationBar from 'components/navigation/NavigationBar';
import NotFound from 'components/navigation/NotFound';
import TitleComposer from './TitleComposer';
import ResourcesList from './ResourcesList';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const InnerContainer = styled.div(
  ({ theme: { colors, workspaceViewport } }) => ({
    background: colors.white,
    margin: '0px auto',
    maxWidth: workspaceViewport,
    padding: '90px 30px 40px',
  })
);

const WorkspaceContainer = ({ workspaceId }) => {
  useUpdateSelectedResource(workspaceId);
  const [viewMode, setViewMode] = useState('all');
  const [forceUpdate, setForceUpdate] = useState(false);
  const { markAsRead } = useViewedReaction();

  useEffect(() => {
    setViewMode('all');
  }, [workspaceId]);

  const { loading, data } = useQuery(workspaceQuery, {
    variables: { workspaceId },
  });

  if (loading) return null;
  if (!data.workspace) return <NotFound />;

  const { title, reactions } = data.workspace;

  const hasCurrentUserViewed = () => {
    return !!(reactions || []).find(
      r => r.code === 'viewed' && matchCurrentUserId(r.author.id)
    );
  };

  if (!hasCurrentUserViewed()) {
    markAsRead({
      isUnread: true,
      resourceType: 'workspace',
      resourceId: workspaceId,
    });
  }

  if (forceUpdate) setForceUpdate(false);

  const value = {
    ...DEFAULT_WORKSPACE_CONTEXT,
    workspaceId,
    viewMode,
    setViewMode,
    setForceUpdate,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      <Container>
        <NavigationBar />
        <InnerContainer>
          <TitleComposer initialTitle={title} />
          <ResourcesList />
        </InnerContainer>
      </Container>
    </WorkspaceContext.Provider>
  );
};

WorkspaceContainer.propTypes = {
  workspaceId: PropTypes.string.isRequired,
};

export default WorkspaceContainer;
