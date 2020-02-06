import React, { useRef, useState, useContext } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';
import { DiscussionContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import TopicComposer from './TopicComposer';
import DiscussionMessage from './DiscussionMessage';
import DiscussionThread from './DiscussionThread';
import ModalAddReplyBox from './ModalAddReplyBox';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  // Vertically center the page when content doesn't fit full height
  minHeight: 'calc(100vh - 60px)', // 60px for the navigation bar

  margin: '0 auto',
  maxWidth: discussionViewport,
}));

const Discussion = () => {
  const { discussionId } = useContext(DiscussionContext);
  const discussionRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionRef);
  const [isFetching, setIsFetching] = useState(false);
  const [isComposing, setIsComposing] = useState(!discussionId);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);

  const { loading, error, data, fetchMore } = useQuery(discussionQuery, {
    variables: { discussionId, queryParams: {} },
  });
  if (loading) return null;
  if (error || !data.discussion) return <NotFound />;

  const { topic, draft } = data.discussion;
  const { items, pageToken } = data.messages;
  const messages = (items || []).map(i => i.message);

  if (draft && !isComposing) startComposing();

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  }

  function fetchMoreMessages() {
    const newQueryParams = {};
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: discussionQuery,
      variables: {
        id: discussionId,
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
          conversation: fetchMoreResult.conversation,
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

  const value = {
    discussionId,
    draft,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <Container ref={discussionRef}>
        <TopicComposer
          initialTopic={topic}
          autoFocus={!topic && !data.messages}
        />
        {messages.length > 0 && <DiscussionThread isUnread={isUnread()} />}
        {isComposing ? (
          <DiscussionMessage
            mode="compose"
            afterCreate={stopComposing}
            handleCancel={stopComposing}
          />
        ) : (
          <ModalAddReplyBox
            handleClickReply={startComposing}
            isComposing={isComposing}
          />
        )}
      </Container>
    </DiscussionContext.Provider>
  );
};

export default Discussion;
