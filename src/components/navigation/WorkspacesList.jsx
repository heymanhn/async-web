import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import workspacesQuery from 'graphql/queries/workspaces';
import { WORKSPACES_QUERY_SIZE } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { snakedQueryParams } from 'utils/queryParams';

import NotFound from 'components/navigation/NotFound';
import CreateWorkspaceButton from './CreateWorkspaceButton';
import ResourceRow from './ResourceRow';

const Container = styled.div({
  flexGrow: 1,
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
      id: userId,
      queryParams: snakedQueryParams({ size: WORKSPACES_QUERY_SIZE }),
    },
  });

  if (loading) return null;
  if (!data.workspaces) return <NotFound />;

  const { items } = data.workspaces;
  const workspaces = (items || []).map(i => i.workspace);

  const isResourceSelected = id => id === selectedResourceId;

  return (
    <Container>
      <HeadingSection>
        <Heading>WORKSPACES</Heading>
        <CreateWorkspaceButton />
      </HeadingSection>
      {workspaces.map(w => (
        <ResourceRow
          key={w.id}
          resourceType="workspace"
          resource={w}
          isSelected={isResourceSelected(w.id)}
        />
      ))}
    </Container>
  );
};

export default WorkspacesList;
