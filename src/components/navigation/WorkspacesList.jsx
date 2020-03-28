import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import workspacesQuery from 'graphql/queries/workspaces';
import { WORKSPACES_QUERY_SIZE } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { snakedQueryParams } from 'utils/queryParams';

import CreateWorkspaceButton from './CreateWorkspaceButton';
import ResourceRow from './ResourceRow';

const Container = styled.div({
  margin: '25px 20px 0',
});

const HeadingSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const Heading = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
  fontWeight: 500,
}));

const WorkspacesList = () => {
  const { selectedResourceId } = useContext(NavigationContext);
  const { userId } = getLocalUser();

  // TODO (HN): Use paginated resource when we figure out how to paginate
  // workspaces and recent items in the sidebar
  const { loading, data } = useQuery(workspacesQuery, {
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: WORKSPACES_QUERY_SIZE }),
    },
  });

  if (loading || !data.workspaces) return null;

  const { items } = data.workspaces;

  const isResourceSelected = id => id === selectedResourceId;

  return (
    <Container>
      <HeadingSection>
        <Heading>WORKSPACES</Heading>
        <CreateWorkspaceButton />
      </HeadingSection>
      {items.map(i => (
        <ResourceRow
          key={i.workspace.id}
          resourceType="workspace"
          resource={i.workspace}
          badgeCount={i.badgeCount}
          isSelected={isResourceSelected(i.workspace.id)}
        />
      ))}
    </Container>
  );
};

export default WorkspacesList;