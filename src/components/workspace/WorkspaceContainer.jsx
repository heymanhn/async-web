import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { DEFAULT_WORKSPACE_CONTEXT, WorkspaceContext } from 'utils/contexts';
import useUpdateSelectedResource from 'utils/hooks/useUpdateSelectedResource';

import NavigationBar from 'components/navigation/NavigationBar';
import Workspace from './Workspace';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const WorkspaceContainer = ({ workspaceId }) => {
  useUpdateSelectedResource(workspaceId);
  const [viewMode, setViewMode] = useState('all');
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    setViewMode('all');
  }, [workspaceId]);

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
