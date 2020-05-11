import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import { DiscussionContext, MessageContext } from 'utils/contexts';
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

const StyledNewMessagesIndicator = styled(NewMessagesIndicator)({
  top: '46px', // vertically align to bottom of the nav bar (60px)
});

const DiscussionMessages = ({ isUnread, ...props }) => {
  const discussionRef = useRef(null);
  const dividerRef = useRef(null);
  const { discussionId, bottomRef, composerRef } = useContext(
    DiscussionContext
  );
  const messageContext = useContext(MessageContext);
  const [currentDiscussionId, setCurrentDiscussionId] = useState(discussionId);
  const markAsRead = useMarkResourceAsRead();

  // Keep track of the current discussion in state to make sure we can mark the
  // discussion as read each time the discussion ID changes.
  useEffect(() => {
    if (discussionId !== currentDiscussionId) {
      if (isUnread) markAsRead();
      setCurrentDiscussionId(discussionId);
    }
  }, [isUnread, markAsRead, discussionId, currentDiscussionId]);

  const { loading, data } = usePaginatedResource(discussionRef, {
    query: discussionMessagesQuery,
    key: 'messages',
    variables: { discussionId, queryParams: {} },
  });

  if (loading) return null;
  if (!data) return <NotFound />;

  const { items } = data;
  const messages = (items || []).map(i => i.message);

  const generateValue = index => ({
    ...messageContext,
    listPosition: index,
  });

  return (
    <Container ref={discussionRef} {...props}>
      <StyledNewMessagesIndicator
        bottomRef={bottomRef}
        composerRef={composerRef}
        dividerRef={dividerRef}
        afterClick={markAsRead}
      />
      {messages.map((m, i) => (
        <React.Fragment key={m.id}>
          {firstNewMessageId(messages) === m.id && m.id !== messages[0].id && (
            <NewMessagesDivider ref={dividerRef} />
          )}
          <MessageContext.Provider value={generateValue(i)}>
            <Message message={m} />
          </MessageContext.Provider>
        </React.Fragment>
      ))}
    </Container>
  );
};

DiscussionMessages.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default DiscussionMessages;
