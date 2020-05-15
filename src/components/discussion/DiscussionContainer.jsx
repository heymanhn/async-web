import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useThreadState from 'hooks/thread/useThreadState';
import useUpdateSelectedResource from 'hooks/resources/useUpdateSelectedResource';
import {
  DiscussionContext,
  MessageContext,
  DEFAULT_DISCUSSION_CONTEXT,
  DEFAULT_MESSAGE_CONTEXT,
} from 'utils/contexts';
import { isResourceUnread, isResourceReadOnly } from 'utils/helpers';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import MessageComposer from 'components/message/MessageComposer';
import NavigationBar from 'components/navigation/NavigationBar';
import NotFound from 'components/navigation/NotFound';
import ThreadModal from 'components/thread/ThreadModal';

import DiscussionMessages from './DiscussionMessages';
import TitleEditor from './TitleEditor';

const OuterContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const ContentContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',

  // Vertically center the page when content doesn't fit full height
  minHeight: 'calc(100vh - 60px)', // Navigation bar is 60px tall
});

const StyledLoadingIndicator = styled(LoadingIndicator)({
  marginTop: '30px',
});

const DiscussionContainer = ({ discussionId, threadId: initialThreadId }) => {
  useUpdateSelectedResource(discussionId);
  const discussionRef = useRef(null);
  const composerRef = useRef(null);
  const bottomRef = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [quoteReply, setQuoteReply] = useState(null);

  // Hides the message composer if the user is an editing a message
  const [hideComposer, setHideComposer] = useState(false);

  const {
    threadId,
    handleShowThread,
    handleCloseThread,
    ...threadProps
  } = useThreadState(initialThreadId);

  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId },
  });

  const { loading: loading2, data: data2 } = useQuery(discussionMessagesQuery, {
    variables: { discussionId, queryParams: { order: 'desc' } },
  });

  if (loading || loading2) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data || !data.discussion || !data2 || !data2.messages)
    return <NotFound />;

  const { title, draft, messageCount, workspaces } = data.discussion;
  const { tags } = data.discussion;
  const readOnly = isResourceReadOnly(tags);

  if (forceUpdate) setForceUpdate(false);

  const afterDeleteDiscussion = () => {
    let path = '/';
    if (workspaces && workspaces.length) {
      const [workspaceId] = workspaces;
      path = `/workspaces/${workspaceId}`;
    }

    navigate(path);
  };

  const discussionValue = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    readOnly,
    hideComposer,
    messageCount,
    bottomRef,
    composerRef,
    quoteReply,

    afterDeleteDiscussion,
    setForceUpdate,
    setHideComposer,
    setQuoteReply,
    handleShowThread,
  };

  const messageValue = {
    ...DEFAULT_MESSAGE_CONTEXT,
    draft,
    isModalOpen: !!threadId,
    parentId: discussionId,
    parentType: 'discussion',
  };

  return (
    <DiscussionContext.Provider value={discussionValue}>
      <OuterContainer>
        <NavigationBar />
        <ContentContainer ref={discussionRef}>
          <MessageContext.Provider value={messageValue}>
            {!!messageCount && <TitleEditor initialTitle={title} />}
            {!!messageCount && (
              <DiscussionMessages isUnread={isResourceUnread(tags)} />
            )}
            <MessageComposer
              ref={composerRef}
              title={title}
              isExpanded={!messageCount}
            />
          </MessageContext.Provider>
          <div ref={bottomRef} />
        </ContentContainer>
        {threadId && (
          <ThreadModal
            threadId={threadId}
            handleClose={handleCloseThread}
            {...threadProps}
          />
        )}
      </OuterContainer>
    </DiscussionContext.Provider>
  );
};

DiscussionContainer.propTypes = {
  discussionId: PropTypes.string.isRequired,
  threadId: PropTypes.string,
};

DiscussionContainer.defaultProps = {
  threadId: null,
};

export default DiscussionContainer;
