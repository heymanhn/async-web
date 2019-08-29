import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import conversationQuery from 'graphql/queries/conversation';

import RovalEditor from 'components/editor/RovalEditor';
import DiscussionMessage from './DiscussionMessage';

const Container = styled.div({
  height: '100vh',
});

const DiscussionContainer = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  minHeight: '100%', // Vertically centers the page when content doesn't fit full height
  margin: '0 auto',
  maxWidth: discussionViewport,
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '36px',
  fontWeight: 500,
  marginBottom: '40px',
  width: '100%',
  outline: 'none',
}));

const Discussion = ({ discussionId }) => {
  const { loading, error, data, fetchMore } = useQuery(conversationQuery, {
    variables: { id: discussionId, queryParams: {} },
  });
  if (loading) return null;
  if (error || !data.conversation) return <div>{error}</div>;

  const { title } = data.conversation;
  const { items, messageCount, pageToken } = data.messages;
  const messages = (items || []).map(i => i.message);

  return (
    <Container>
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
