import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import conversationQuery from 'graphql/queries/conversation';
import useSelectedMeeting from 'utils/hooks/useSelectedMeeting';
import useMountEffect from 'utils/hooks/useMountEffect';
import { page } from 'utils/analytics';

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

  useMountEffect(() => {
    const title = conversationId ? 'Discussion' : 'New Discussion';
    const properties = {};
    if (conversationId) properties.discussionId = conversationId;
    if (meetingId) properties.meetingSpaceId = meetingId;

    page(title, properties);
  });

  if (conversationId && !data) {
    getConversation();
    return null;
  }

  let fetchedTitle = null;
  let conversation = null;
  if ((!loading && (!data || !data.conversation)) && !meetingId) return <NotFound />;
  if (data && data.conversation) {
    ({ conversation } = data);
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

  function afterSubmit(value) {
    setConversationId(value);

    // Update the URL in the address bar to reflect the new discussion
    const { origin } = window.location;
    const url = `${origin}/discussions/${value}`;
    return window.history.replaceState({}, `discussion: ${value}`, url);
  }

  return (
    <Container {...props}>
      <NavigationBar
        discussionTitle={fetchedTitle}
        meetingId={meetingId}
      />
      {conversationId && !loading && meetingId && (
        <DiscussionThread
          conversationId={conversationId}
          isUnread={isUnread()}
          meetingId={meetingId}
        />
      )}
      {meetingId && !conversation && (
        <DiscussionComposer afterSubmit={afterSubmit} meetingId={meetingId} />
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
