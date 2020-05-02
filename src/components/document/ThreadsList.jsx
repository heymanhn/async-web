import React, { useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';

import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import {
  DocumentContext,
  DiscussionContext,
  DEFAULT_DISCUSSION_CONTEXT,
} from 'utils/contexts';
import useMessageDraftMutations from 'hooks/message/useMessageDraftMutations';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import Message from 'components/message/Message';
import ThreadListItem from './ThreadListItem';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  margin: '60px auto',
  width: documentViewport,
}));

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '40px auto',
});

const TitleSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '32px',
  fontWeight: 600,
  letterSpacing: '-0.021em',
}));

const StartDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  background: colors.blue,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '5px 20px',
}));

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

// HN: There should be a way to DRY up these style declarations
const StyledMessage = styled(Message)(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '40px 0',
}));

const ThreadsList = () => {
  const listRef = useRef(null);
  const { documentId } = useContext(DocumentContext);
  const { handleSaveMessageDraft, isSubmitting } = useMessageDraftMutations();

  const [isComposing, setIsComposing] = useState(false);
  const [discussionId, setDiscussionId] = useState(null);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => {
    setDiscussionId(null);
    setIsComposing(false);
  };

  const handleStartDiscussion = async () => {
    // Create an empty draft discussion
    const { discussionId: threadId } = await handleSaveMessageDraft({
      isThread: true,
    });

    setDiscussionId(threadId);
    startComposing();
  };

  const { loading, data } = usePaginatedResource(
    listRef,
    {
      query: documentDiscussionsQuery,
      key: 'documentDiscussions',
      variables: { id: documentId, queryParams: { order: 'desc' } },
    },
    300
  );

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;

  const { items } = data;
  const discussions = (items || []).map(i => i.discussion);
  const discussionCount = discussions.length;

  if (!discussionCount && !isComposing) setIsComposing(true);

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    afterCreateDiscussion: id => setDiscussionId(id),
  };

  return (
    <Container ref={listRef}>
      <TitleSection>
        <Title>{discussionCount ? 'Discussions' : 'Start a discussion'}</Title>
        {isSubmitting ? (
          <LoadingIndicator color="grey4" size="16" />
        ) : (
          <StartDiscussionButton onClick={handleStartDiscussion}>
            <Label>Start a discussion</Label>
          </StartDiscussionButton>
        )}
      </TitleSection>
      <DiscussionContext.Provider value={value}>
        {isComposing && (
          <StyledMessage
            mode="compose"
            afterCreateMessage={stopComposing}
            handleCancel={stopComposing}
            parentId={discussionId}
            parentType="thread"
          />
        )}
      </DiscussionContext.Provider>
      {discussions.map(d => (
        <ThreadListItem key={d.id} threadId={d.id} />
      ))}
    </Container>
  );
};

export default ThreadsList;
