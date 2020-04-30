/*
 * TODO: Figure out how much this component can be DRY'ed up with
 * <ThreadMessages />
 */
import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import useMountEffect from 'hooks/shared/useMountEffect';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import usePendingMessages from 'hooks/resources/usePendingMessages';
import { DiscussionContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import Message from 'components/message/Message';

import NewMessagesDivider from './NewMessagesDivider';
import NewMessagesIndicator from './NewMessagesIndicator';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const DiscussionMessages = ({ isComposingFirstMsg, isUnread, ...props }) => {
  const discussionRef = useRef(null);
  const { discussionId } = useContext(DiscussionContext);
  const markAsRead = useMarkResourceAsRead();
  const pendingMessages = usePendingMessages();

  useMountEffect(() => {
    if (isUnread) markAsRead();
  });

  const { loading, data } = usePaginatedResource(discussionRef, {
    query: discussionMessagesQuery,
    key: 'messages',
    variables: { discussionId, queryParams: {} },
  });

  // Workaround to make sure two copies of the first message aren't rendered
  // on the modal at the same time
  if (loading || isComposingFirstMsg) return null;
  if (!data) return <NotFound />;

  const { items } = data;
  const messages = (items || []).map(i => i.message);

  const scrollToFirstPendingMessage = () => {
    const [messageId] = pendingMessages;
    if (messageId) navigate(`#${messageId}`);
    markAsRead();
  };

  const firstNewMessageId = () => {
    const targetMessage = messages.find(
      m => m.tags && m.tags.includes('new_message')
    );

    return targetMessage ? targetMessage.id : null;
  };

  return (
    <Container ref={discussionRef} {...props}>
      {!!pendingMessages.length && (
        <NewMessagesIndicator
          count={pendingMessages.length}
          onClick={scrollToFirstPendingMessage}
        />
      )}
      {messages.map((m, i) => (
        <React.Fragment key={m.id}>
          {firstNewMessageId() === m.id && m.id !== messages[0].id && (
            <NewMessagesDivider />
          )}
          <Message
            index={i}
            message={m}
            parentId={discussionId}
            parentType="discussion"
          />
        </React.Fragment>
      ))}
    </Container>
  );
};

DiscussionMessages.propTypes = {
  isComposingFirstMsg: PropTypes.bool.isRequired,
  isUnread: PropTypes.bool.isRequired,
};

export default DiscussionMessages;
