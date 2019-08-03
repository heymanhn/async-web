import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import DiscussionsListCell from './DiscussionsListCell';

const Container = styled.div(({ theme: { colors } }) => ({
  border: `1px solid ${colors.borderGrey}`,
  marginLeft: '20px',
  marginTop: '15px',
}));

const DiscussionsList = ({ conversations, onSelectConversation }) => (
  <Container>
    {conversations.map(c => (
      <DiscussionsListCell
        key={c.id}
        conversationId={c.id}
        lastMessage={c.lastMessage}
        messageCount={c.messageCount}
        onSelectConversation={onSelectConversation}
        title={c.title}
      />
    ))}
  </Container>
);

DiscussionsList.propTypes = {
  conversations: PropTypes.array.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
};

export default DiscussionsList;
