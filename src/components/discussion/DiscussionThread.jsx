import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery, useMutation } from 'react-apollo';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import localStateQuery from 'graphql/queries/localState';
import localAddPendingMessages from 'graphql/mutations/local/addPendingMessagesToDiscussion';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import useViewedReaction from 'utils/hooks/useViewedReaction';
import useMountEffect from 'utils/hooks/useMountEffect';
import { snakedQueryParams } from 'utils/queryParams';
import { DiscussionContext } from 'utils/contexts';

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
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionRef);
  const [isFetching, setIsFetching] = useState(false);
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

  const { loading, error, data, fetchMore } = useQuery(discussionQuery, {
    variables: { discussionId, queryParams: {} },
  });
  const { data: localData } = useQuery(localStateQuery);

  if (loading) return null;
  if (error || !data.messages) return <div>{error}</div>;

  const { items, pageToken } = data.messages;
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

  const fetchMoreMessages = () => {
    const newQueryParams = {};
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: discussionQuery,
      variables: {
        discussionId,
        queryParams: snakedQueryParams(newQueryParams),
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.messages;
        const {
          items: newItems,
          pageToken: newToken,
        } = fetchMoreResult.messages;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          // REFACTOR TODO:
          // Can I simply spread fetchMoreResult here?
          // Can I do the same for other usages?
          //
          // OR: break the query back apart into two.
          discussion: fetchMoreResult.discussion,
          messages: {
            pageToken: newToken,
            messageCount: fetchMoreResult.messages.messageCount,
            items: [...previousItems, ...newItems],
            __typename: fetchMoreResult.messages.__typename, // instead of doing this, spread it.
          },
        };
      },
    });
  };

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreMessages();
  }

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
