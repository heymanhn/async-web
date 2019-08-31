import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import conversationQuery from 'graphql/queries/conversation';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';

import RovalEditor from 'components/editor/RovalEditor';
import DiscussionMessage from './DiscussionMessage';
import NavigationBar from './NavigationBar';

const Container = styled.div({});

const DiscussionContainer = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  // Vertically center the page when content doesn't fit full height
  minHeight: 'calc(100vh - 60px)', // 60px for the navigation bar

  margin: '0 auto',
  maxWidth: discussionViewport,
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '36px',
  fontWeight: 500,
  margin: '70px 0 30px',
  width: '100%',
  outline: 'none',
}));

const Discussion = ({ discussionId }) => {
  // const discussionRef = useRef(null);
  // const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionRef);

  const { loading, error, data, fetchMore } = useQuery(conversationQuery, {
    variables: { id: discussionId, queryParams: {} },
  });
  if (loading) return null;
  if (error || !data.conversation) return <div>{error}</div>;

  const { meetingId, title } = data.conversation;
  const { items, messageCount, pageToken } = data.messages;
  const messages = (items || []).map(i => i.message);

  // if (shouldFetch && pageToken && !isFetching) {
  //   setIsFetching(true);
  //   fetchMoreMessages();
  // }

  return (
    <Container>
      <NavigationBar
        discussionTitle={title}
        meetingId={meetingId}
      />
      <DiscussionContainer>
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
            message={m}
          />
        ))}
      </DiscussionContainer>
    </Container>
  );
};

Discussion.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default Discussion;
