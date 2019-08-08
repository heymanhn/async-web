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

const StyledLink = styled(Link)({
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
  },
});

const MeetingSpaceLabel = styled.div(({ theme: { colors } }) => ({
  background: colors.borderGrey,
  borderRadius: '5px',
  color: colors.mainText,
  fontSize: '12px',
  fontWeight: 500,
  padding: '3px 12px',
  textDecoration: 'none',
}));

const DiscussionTitle = styled.span(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '20px',
  fontWeight: 500,
  width: '100%',

  ':hover': {
    color: colors.blue,
  },
}));

const FeedItemHeader = ({ conversation, meeting, numNewMessages, ...props }) => {
  const { id: conversationId, messageCount, title: conversationTitle } = conversation;
  const { id: meetingId, title: meetingTitle } = meeting;
  const totalMessageCount = messageCount + numNewMessages;

  return (
    <Container {...props}>
      <MetadataRow>
        <ReplyCountDisplay>
          {totalMessageCount > 1 ? Pluralize('message', totalMessageCount, true) : 'No replies'}
        </ReplyCountDisplay>
        <StyledLink to={`/spaces/${meetingId}`}>
          <MeetingSpaceLabel>
            {meetingTitle}
          </MeetingSpaceLabel>
        </StyledLink>
      </MetadataRow>
      <StyledLink to={`/spaces/${meetingId}/conversations/${conversationId}`}>
        <DiscussionTitle>{conversationTitle || 'Untitled Discussion'}</DiscussionTitle>
      </StyledLink>
    </Container>
  );
};

FeedItemHeader.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
  numNewMessages: PropTypes.number,
};

FeedItemHeader.defaultProps = {
  numNewMessages: 0,
};

export default FeedItemHeader;