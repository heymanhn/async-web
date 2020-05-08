import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useUpdateSelectedResource from 'hooks/resources/useUpdateSelectedResource';
import { DEFAULT_WORKSPACE_CONTEXT, WorkspaceContext } from 'utils/contexts';

import NavigationBar from 'components/navigation/NavigationBar';

import Workspace from './Workspace';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const WorkspaceContainer = ({ workspaceId: initialWorkspaceId }) => {
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
  const [viewMode, setViewMode] = useState('all');
  const [forceUpdate, setForceUpdate] = useState(false);
  useUpdateSelectedResource(workspaceId);

  useEffect(() => {
    if (initialWorkspaceId !== workspaceId) {
      setViewMode('all');
      setWorkspaceId(initialWorkspaceId);
    }
  }, [workspaceId, initialWorkspaceId]);

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
        <Workspace />
      </Container>
    </WorkspaceContext.Provider>
  );
};

WorkspaceContainer.propTypes = {
  workspaceId: PropTypes.string.isRequired,
};

export default WorkspaceContainer;
