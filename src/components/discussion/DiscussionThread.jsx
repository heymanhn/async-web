import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery, useMutation } from 'react-apollo';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import localStateQuery from 'graphql/queries/localState';
import localAddPendingMessages from 'graphql/mutations/local/addPendingMessagesToDiscussion';
import usePaginatedResource from 'utils/hooks/usePaginatedResource';
import useViewedReaction from 'utils/hooks/useViewedReaction';
import useMountEffect from 'utils/hooks/useMountEffect';
import { DiscussionContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import DiscussionMessage from './DiscussionMessage';
import NewMessagesDivider from './NewMessagesDivider';
import NewMessagesIndicator from './NewMessagesIndicator';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  maxWidth: discussionViewport,
}));

const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ isUnread, theme: { colors } }) => ({
    backgroundColor: isUnread ? colors.unreadBlue : 'default',
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: `0px 0px 3px ${colors.grey7}`,
    marginBottom: '30px',
  })
);

const DiscussionThread = ({ isUnread }) => {
  const client = useApolloClient();
  const discussionRef = useRef(null);
  const { discussionId } = useContext(DiscussionContext);
  const [pendingMessageCount, setPendingMessageCount] = useState(0);
  const [addPendingMessages] = useMutation(localAddPendingMessages, {
    variables: { discussionId },
  });

  const { markAsRead } = useViewedReaction();

  useMountEffect(() => {
    client.writeData({ data: { pendingMessages: [] } });

    return () => {
      markAsRead({
        isUnread,
        objectType: 'discussion',
        objectId: discussionId,
      });
    };
  });

  const key = 'messages';
  const { data: localData } = useQuery(localStateQuery);
  const { loading, data } = usePaginatedResource(discussionRef, {
    query: discussionMessagesQuery,
    key,
    variables: { discussionId, queryParams: {} },
  });

  if (loading) return null;
  if (!data[key]) return <NotFound />;

  const { items } = data[key];
  const messages = (items || []).map(i => i.message);

  if (localData) {
    const { pendingMessages } = localData;
    if (pendingMessages && pendingMessages.length !== pendingMessageCount) {
      setPendingMessageCount(pendingMessages.length);
    }
  }

  const handleAddPendingMessages = () => {
    addPendingMessages();

    markAsRead({
      isUnread: false,
      objectType: 'discussion',
      objectId: discussionId,
    });
  };

  const firstNewMessageId = () => {
    const targetMessage = messages.find(
      m => m.tags && m.tags.includes('new_message')
    );

    return targetMessage ? targetMessage.id : null;
  };
  const isNewMessage = m => m.tags && m.tags.includes('new_message');

  return (
    <Container ref={discussionRef}>
      {pendingMessageCount > 0 && (
        <NewMessagesIndicator
          count={pendingMessageCount}
          onClick={handleAddPendingMessages}
        />
      )}
      {messages.map((m, i) => (
        <React.Fragment key={m.id}>
          {firstNewMessageId() === m.id && m.id !== messages[0].id && (
            <NewMessagesDivider />
          )}
          <StyledDiscussionMessage
            index={i}
            message={m}
            source="discussionModal"
            isUnread={isNewMessage(m)}
          />
        </React.Fragment>
      ))}
    </Container>
  );
};

DiscussionThread.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default DiscussionThread;
