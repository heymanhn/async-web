import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import conversationQuery from 'graphql/queries/conversation';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';

import RovalEditor from 'components/editor/RovalEditor';
import DiscussionMessage from './DiscussionMessage';
import MessageComposer from './MessageComposer';
import NavigationBar from './NavigationBar';

const Container = styled.div({
  marginBottom: '60px',
});

const DiscussionContainer = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: discussionViewport,
  padding: '0 30px',
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '36px',
  fontWeight: 500,
  margin: '70px 0 30px',
  width: '100%',
  outline: 'none',
}));

const Discussion = ({ conversationId, ...props }) => {
  const discussionRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionRef);
  const [isFetching, setIsFetching] = useState(false);

  const { loading, error, data, fetchMore } = useQuery(conversationQuery, {
    variables: { id: conversationId },
  });
  if (loading) return null;
  if (error || !data.conversation) return <div>{error}</div>;

  const { meetingId, title } = data.conversation;
  const { items, pageToken } = data.messages;
  const messages = (items || []).map(i => i.message);

  function fetchMoreMessages() {
    const newQueryParams = {};
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: conversationQuery,
      variables: { id: conversationId, queryParams: snakedQueryParams(newQueryParams) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.messages;
        const { items: newItems, pageToken: newToken } = fetchMoreResult.messages;
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

  return (
    <Container {...props}>
      <NavigationBar
        discussionTitle={title}
        meetingId={meetingId}
      />
      <DiscussionContainer ref={discussionRef}>
        <TitleEditor
          contentType="discussionTitle"
          initialValue={title || 'Untitled Discussion'}
          isPlainText
          onSubmit={() => {}}
          saveOnBlur
        />
        {messages.map(m => (
          <DiscussionMessage
            key={m.id}
            conversationId={conversationId}
            initialMessage={m}
          />
        ))}
        {!pageToken && <MessageComposer conversationId={conversationId} />}
      </DiscussionContainer>
    </Container>
  );
};

Discussion.propTypes = {
  conversationId: PropTypes.string.isRequired,
};

export default Discussion;
