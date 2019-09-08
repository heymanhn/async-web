import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import conversationQuery from 'graphql/queries/conversation';

import DiscussionComposer from './DiscussionComposer';
import DiscussionThread from './DiscussionThread';
import NavigationBar from './NavigationBar';

const Container = styled.div({
  marginBottom: '60px',
});

const Discussion = ({
  conversationId: initialConversationId,
  meetingId: initialMeetingId,
  ...props
}) => {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [meetingId, setMeetingId] = useState(initialMeetingId);
  const [getConversation, { loading, data }] = useLazyQuery(conversationQuery, {
    variables: { id: conversationId, queryParams: {} },
  });
  if (conversationId && !data) {
    getConversation();
    return null;
  }

  let fetchedTitle = null;
  if (data && data.conversation && !meetingId) {
    setMeetingId(data.conversation.meetingId);
    fetchedTitle = data.conversation.title;
  }

  return (
    <Container {...props}>
      {meetingId && (
        <NavigationBar
          discussionTitle={fetchedTitle}
          meetingId={meetingId}
        />
      )}
      {conversationId && !loading ? (
        <DiscussionThread conversationId={conversationId} />
      ) : (
        <DiscussionComposer afterSubmit={setConversationId} meetingId={meetingId} />
      )}
    </Container>
  );
};

Discussion.propTypes = {
  conversationId: PropTypes.string,
  meetingId: PropTypes.string,
};

Discussion.defaultProps = {
  conversationId: null,
  meetingId: null,
};

export default Discussion;
