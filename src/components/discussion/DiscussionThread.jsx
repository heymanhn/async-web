import React, { useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import useViewedReaction from 'utils/hooks/useViewedReaction';
import { snakedQueryParams } from 'utils/queryParams';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import DiscussionMessage from './DiscussionMessage';
import NewMessagesIndicator from './NewMessagesIndicator';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  margin: '0 auto',
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
  const discussionRef = useRef(null);
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionRef);
  const [isFetching, setIsFetching] = useState(false);

  const { markAsRead } = useViewedReaction();
  useEffect(() => {
    return () => {
      markAsRead({
        isUnread,
        objectType: 'discussion',
        objectId: discussionId,
        parentId: documentId,
      });
    };
  });

  const { loading, error, data, fetchMore } = useQuery(discussionQuery, {
    variables: { discussionId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.messages) return <div>{error}</div>;

  const { items, pageToken } = data.messages;
  const messages = (items || []).map(i => i.message);

  function fetchMoreMessages() {
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
          discussion: fetchMoreResult.discussion,
          messages: {
            pageToken: newToken,
            messageCount: fetchMoreResult.messages.messageCount,
            items: [...previousItems, ...newItems],
            __typename: fetchMoreResult.messages.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreMessages();
  }

  function firstNewMessageId() {
    const targetMessage = messages.find(
      m => m.tags && m.tags.includes('new_messages')
    );

    return targetMessage ? targetMessage.id : null;
  }

  function isNewMessage(m) {
    return m.tags && m.tags.includes('new_message');
  }

  return (
    <Container ref={discussionRef}>
      {messages.map(m => (
        <React.Fragment key={m.id}>
          {firstNewMessageId() === m.id && m.id !== messages[0].id && (
            <NewMessagesIndicator />
          )}
          <StyledDiscussionMessage message={m} isUnread={isNewMessage(m)} />
        </React.Fragment>
      ))}
    </Container>
  );
};

DiscussionThread.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default DiscussionThread;
