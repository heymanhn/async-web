import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useThreadState from 'hooks/thread/useThreadState';
import useUpdateSelectedResource from 'hooks/resources/useUpdateSelectedResource';
import { DiscussionContext, DEFAULT_DISCUSSION_CONTEXT } from 'utils/contexts';
import { isResourceUnread, isResourceReadOnly } from 'utils/helpers';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import Message from 'components/message/Message';
import NavigationBar from 'components/navigation/NavigationBar';
import NotFound from 'components/navigation/NotFound';
import ThreadModal from 'components/thread/ThreadModal';

import AddReplyBox from './AddReplyBox';
import DiscussionMessages from './DiscussionMessages';
import TopicComposer from './TopicComposer';

const OuterContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const ContentContainer = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  // Vertically center the page when content doesn't fit full height
  minHeight: 'calc(100vh - 60px)', // Navigation bar is 60px tall
  margin: '0 auto',
  paddingBottom: '80px',
  width: discussionViewport,
}));

const StyledLoadingIndicator = styled(LoadingIndicator)({
  marginTop: '30px',
});

const StyledMessage = styled(Message)(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
}));

const DiscussionContainer = ({ discussionId, threadId: initialThreadId }) => {
  useUpdateSelectedResource(discussionId);
  const discussionRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);
  const [forceUpdate, setForceUpdate] = useState(false);

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
    variables: { discussionId, queryParams: {} },
  });

  if (loading || loading2) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data.discussion || !data2.messages) return <NotFound />;

  const { topic, draft, messageCount } = data.discussion;
  const { text } = topic || {};
  const { tags } = data.discussion;

  if ((draft || !messageCount) && !isComposing) startComposing();

  const readOnly = isResourceReadOnly(tags);
  const returnToInbox = () => navigate('/inbox');

  const handleCancelCompose = () => {
    stopComposing();
    if (!messageCount) returnToInbox();
  };

  if (forceUpdate) setForceUpdate(false);

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    readOnly,
    afterDelete: returnToInbox,
    setForceUpdate,
    handleShowThread,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <OuterContainer>
        <NavigationBar />
        <ContentContainer ref={discussionRef}>
          <TopicComposer
            initialTopic={text}
            autoFocus={!text && !messageCount}
          />
          {!!messageCount && (
            <DiscussionMessages
              isUnread={isResourceUnread(tags)}
              isComposingFirstMsg={!messageCount}
            />
          )}
          {isComposing ? (
            <StyledMessage
              mode="compose"
              parentId={discussionId}
              draft={draft}
              disableAutoFocus={!messageCount}
              afterCreate={stopComposing}
              handleCancel={handleCancelCompose}
            />
          ) : (
            <AddReplyBox
              handleClickReply={startComposing}
              isComposing={isComposing}
            />
          )}
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
