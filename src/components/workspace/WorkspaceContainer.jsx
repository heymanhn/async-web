import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { DEFAULT_WORKSPACE_CONTEXT, WorkspaceContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import TitleComposer from './TitleComposer';
import ResourceFilters from './ResourceFilters';
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
  const [viewMode, setViewMode] = useState('all');

  const { loading, data } = useQuery(workspaceQuery, {
    variables: { workspaceId },
  });

  if (loading) return null;
  if (!data.workspace) return <NotFound />;

  const { title } = data.workspace;

  const value = {
    ...DEFAULT_WORKSPACE_CONTEXT,
    workspaceId,
    viewMode,
    setViewMode,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      <Container>
        {/* <NavBar /> */}
        <InnerContainer>
          <TitleComposer initialTitle={title} />
          <ResourceFilters />
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
