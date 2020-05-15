import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import { matchCurrentUserId } from 'utils/auth';
import { WorkspaceContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';

import ResourcesList from './ResourcesList';
import TitleEditor from './TitleEditor';

const Container = styled.div(({ theme: { colors, workspaceViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // the new document state is vertically centered

  background: colors.white,
  margin: '0px auto',
  maxWidth: workspaceViewport,
  minHeight: 'calc(100vh - 60px)', // Navigation bar is 60px tall
}));

const Workspace = () => {
  const { workspaceId } = useContext(WorkspaceContext);
  const [sentReaction, setSentReaction] = useState(false);
  const markAsRead = useMarkResourceAsRead();

  const { loading, data } = useQuery(workspaceQuery, {
    variables: { workspaceId },
  });

  if (loading) return null;
  if (!data || !data.workspace) return <NotFound />;

  const { title, reactions } = data.workspace;

  // The only time we need to mark a workspace as read is when the user is
  // first invited to the workspace.
  const hasFirstView = !!(reactions || []).find(
    r => r.code === 'viewed' && matchCurrentUserId(r.author.id)
  );
  if (!hasFirstView && !sentReaction) {
    markAsRead();
    setSentReaction(true);
  }

  return (
    <Container>
      <TitleEditor initialTitle={title} />
      <ResourcesList />
    </Container>
  );
};

export default Workspace;
