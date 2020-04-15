import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { matchCurrentUserId } from 'utils/auth';
import { WorkspaceContext } from 'utils/contexts';
import useViewedReaction from 'utils/hooks/useViewedReaction';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import TitleComposer from './TitleComposer';
import ResourcesList from './ResourcesList';

const Container = styled.div(({ theme: { colors, workspaceViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: workspaceViewport,
  padding: '90px 30px 40px',
}));

const StyledLoadingIndicator = styled(LoadingIndicator)({
  marginTop: '30px',
});

const Workspace = () => {
  const { workspaceId } = useContext(WorkspaceContext);
  const markAsRead = useViewedReaction();

  const { loading, data } = useQuery(workspaceQuery, {
    variables: { workspaceId },
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data || !data.workspace) return <NotFound />;

  const { title, reactions } = data.workspace;

  // The only time we need to mark a workspace as read is when the user is
  // first invited to the workspace.
  const hasFirstView = !!(reactions || []).find(
    r => r.code === 'viewed' && matchCurrentUserId(r.author.id)
  );
  if (!hasFirstView) markAsRead();

  return (
    <Container>
      <TitleComposer initialTitle={title} />
      <ResourcesList />
    </Container>
  );
};

export default Workspace;
