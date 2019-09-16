import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import conversationQuery from 'graphql/queries/conversation';
import useSelectedMeeting from 'utils/hooks/useSelectedMeeting';

import NotFound from 'components/navigation/NotFound';
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
  const checkSelectedMeeting = useSelectedMeeting();
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
  let conversation = null;
  if ((!loading && (!data || !data.conversation)) && !meetingId) return <NotFound />;
  if (data && data.conversation) {
    conversation = { data };
    if (!meetingId) {
      setMeetingId(conversation.meetingId);
    } else {
      checkSelectedMeeting(conversation.meetingId);
    }
    fetchedTitle = conversation.title;
  }

  function isUnread() {
    const { tags } = data.conversation;
    const safeTags = tags || [];
    return safeTags.includes('new_messages') || safeTags.includes('new_discussion');
  }

  return (
    <Container {...props}>
      <NavigationBar
        discussionTitle={fetchedTitle}
        meetingId={meetingId}
      />
      {conversationId && !loading && (
        <DiscussionThread
          conversationId={conversationId}
          isUnread={isUnread()}
          meetingId={meetingId}
        />
      )}
      {meetingId && !conversation && (
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
