import React, { useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';

import documentThreadsQuery from 'graphql/queries/documentThreads';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import {
  DEFAULT_MESSAGE_CONTEXT,
  DEFAULT_THREAD_CONTEXT,
  DocumentContext,
  MessageContext,
  ThreadContext,
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

const Title = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 32, weight: 600 }),
  color: colors.mainText,
}));

const StartDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  background: colors.blue,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '5px 20px',
}));

const Label = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  color: colors.white,
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
  const [threadId, setThreadId] = useState(null);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => {
    setThreadId(null);
    setIsComposing(false);
  };

  const handleStartThread = async () => {
    // Create an empty draft discussion
    const { discussionId: tId } = await handleSaveMessageDraft({
      isThread: true,
    });

    setThreadId(tId);
    startComposing();
  };

  const { loading, data } = usePaginatedResource({
    queryDetails: {
      query: documentThreadsQuery,
      key: 'documentThreads',
      variables: { id: documentId, queryParams: { order: 'desc' } },
    },
    containerRef: listRef,
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;

  const { items } = data;
  const threads = (items || []).map(i => i.discussion);
  const threadCount = threads.length;

  const threadValue = {
    ...DEFAULT_THREAD_CONTEXT,
    threadId,
    afterCreateDiscussion: id => setThreadId(id),
  };

  const messageValue = {
    ...DEFAULT_MESSAGE_CONTEXT,
    parentType: 'thread',
    parentId: threadId,
  };

  return (
    <Container ref={listRef}>
      <TitleSection>
        <Title>{threadCount ? 'Threads' : 'Start a thread'}</Title>
        {isSubmitting ? (
          <LoadingIndicator color="grey4" size="16" />
        ) : (
          <StartDiscussionButton onClick={handleStartThread}>
            <Label>Start a thread</Label>
          </StartDiscussionButton>
        )}
      </TitleSection>
      <ThreadContext.Provider value={threadValue}>
        {isComposing && (
          <MessageContext.Provider value={messageValue}>
            <StyledMessage
              mode="compose"
              afterCreateMessage={stopComposing}
              handleCancel={stopComposing}
            />
          </MessageContext.Provider>
        )}
      </ThreadContext.Provider>
      {threads.map(d => (
        <ThreadListItem key={d.id} threadId={d.id} />
      ))}
    </Container>
  );
};

export default ThreadsList;
