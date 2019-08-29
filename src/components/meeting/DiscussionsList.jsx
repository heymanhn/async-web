/* eslint no-underscore-dangle: 0 */
/* eslint jsx-a11y/accessible-emoji: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import meetingConversationsQuery from 'graphql/queries/meetingConversations';
import { snakedQueryParams } from 'utils/queryParams';

import DiscussionsListCell from './DiscussionsListCell';

const Container = styled.div(({ theme: { colors } }) => ({
  border: `1px solid ${colors.borderGrey}`,
  margin: '15px 0 30px 20px',
}));

const EmptyContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  border: `1px dashed ${colors.grey6}`,
  color: colors.grey4,
  cursor: 'default',
  fontSize: '16px',
  fontWeight: 500,
  margin: '15px 0 30px 20px',
  padding: '20px',
}));

const ThinkingFace = styled.span({
  fontSize: '24px',
  marginLeft: '5px',
});

const DiscussionsList = ({
  meetingId,
  onScrollTo,
  onSelectConversation,
  selectedConversationId,
}) => {
  const { loading, error, data } = useQuery(meetingConversationsQuery, {
    variables: { id: meetingId, queryParams: snakedQueryParams({ excludeChildLevel: true }) },
  });
  if (loading) return null;
  if (error || !data.meetingConversations) return <div>{error}</div>;

  const { items } = data.meetingConversations;
  const conversations = (items || []).map(i => i.conversation);

  if (!conversations || !conversations.length) {
    return (
      <EmptyContainer>
        No discussions yet. It’s a little quiet here
        <ThinkingFace role="img" aria-label="Thinking face">🙄</ThinkingFace>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      {conversations.map(c => (
        <DiscussionsListCell
          key={c.id}
          conversation={c}
          onScrollTo={onScrollTo}
          onSelectConversation={onSelectConversation}
          isSelected={selectedConversationId === c.id}
        />
      ))}
    </Container>
  );
};

DiscussionsList.propTypes = {
  meetingId: PropTypes.string.isRequired,
  onScrollTo: PropTypes.func,
  onSelectConversation: PropTypes.func.isRequired,
  selectedConversationId: PropTypes.string,
};

DiscussionsList.defaultProps = {
  onScrollTo: undefined,
  selectedConversationId: null,
};

export default DiscussionsList;
