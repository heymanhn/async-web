import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '25px 30px',
}));

const MetadataRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ReplyCountDisplay = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
}));

const MeetingSpaceLabel = styled.div(({ theme: { colors } }) => ({
  background: colors.borderGrey,
  borderRadius: '5px',
  color: colors.mainText,
  fontSize: '12px',
  fontWeight: 500,
  padding: '3px 12px',
  textDecoration: 'none',
}));

const DiscussionTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '20px',
  fontWeight: 500,
}));

const FeedItemHeader = ({ conversation, meeting, ...props }) => {
  const { id: conversationId, messages, messageCount, title: conversationTitle } = conversation;
  const { id: meetingId, title: meetingTitle } = meeting;
  const replyCount = messageCount - 1;

  return (
    <Container {...props}>
      <MetadataRow>
        <ReplyCountDisplay>
          {replyCount > 0 ? Pluralize('reply', replyCount) : 'No replies'}
        </ReplyCountDisplay>
        <Link to={`/spaces/${meetingId}`}>
          <MeetingSpaceLabel>
            {meetingTitle}
          </MeetingSpaceLabel>
        </Link>
      </MetadataRow>
      <Link to={`/spaces/${meetingId}/conversations/${conversationId}`}>
        <DiscussionTitle>{conversationTitle}</DiscussionTitle>
      </Link>
    </Container>
  );
};

FeedItemHeader.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default FeedItemHeader;
