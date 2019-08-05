import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import DiscussionsListCell from './DiscussionsListCell';

const Container = styled.div(({ theme: { colors } }) => ({
  border: `1px solid ${colors.borderGrey}`,
  margin: '15px 0px 30px 20px',
}));

const DiscussionsList = ({ conversations, onSelectConversation, selectedConversationId }) => (
  <Container>
    {conversations.map(c => (
      <DiscussionsListCell
        key={c.id}
        conversationId={c.id}
        lastMessage={c.lastMessage}
        messageCount={c.messageCount}
        onSelectConversation={onSelectConversation}
        isSelected={selectedConversationId === c.id}
        title={c.title}
      />
    ))}
  </Container>
);

DiscussionsList.propTypes = {
  conversations: PropTypes.array.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  selectedConversationId: PropTypes.string,
};

DiscussionsList.defaultProps = {
  selectedConversationId: null,
};

export default DiscussionsList;
