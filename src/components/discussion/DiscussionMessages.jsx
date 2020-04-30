import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import useMountEffect from 'hooks/shared/useMountEffect';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import { DiscussionContext } from 'utils/contexts';
import { firstNewMessageId } from 'utils/helpers';

import NotFound from 'components/navigation/NotFound';
import Message from 'components/message/Message';

import NewMessagesDivider from 'components/shared/NewMessagesDivider';
import NewMessagesIndicator from 'components/shared/NewMessagesIndicator';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const DiscussionMessages = ({ isComposingFirstMsg, isUnread, ...props }) => {
  const discussionRef = useRef(null);
  const dividerRef = useRef(null);
  const { discussionId, bottomRef } = useContext(DiscussionContext);
  const markAsRead = useMarkResourceAsRead();

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

  const scrollToBottom = () => {
    const { current: bottomOfPage } = bottomRef;
    if (bottomOfPage) bottomOfPage.scrollIntoView();

    markAsRead();
  };

  return (
    <Container ref={discussionRef} {...props}>
      <NewMessagesIndicator
        dividerRef={dividerRef}
        handleClick={scrollToBottom}
      />
      {messages.map((m, i) => (
        <React.Fragment key={m.id}>
          {firstNewMessageId(messages) === m.id && m.id !== messages[0].id && (
            <NewMessagesDivider ref={dividerRef} />
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
