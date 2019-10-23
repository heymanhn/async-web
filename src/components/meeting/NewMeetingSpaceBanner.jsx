/* eslint jsx-a11y/accessible-emoji: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { MeetingSpaceBanner } from 'styles/shared';

import StartDiscussionButton from './StartDiscussionButton';

const InnerContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '30px 30px 35px',
});

const Message = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '15px',
});

const Icon = styled.span({
  fontSize: '32px',
  fontWeight: 500,
  marginRight: '15px',
});

const MessageText = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '16px',
}));

const NewMeetingSpaceBanner = ({ isAddedParticipant, meetingId }) => {
  const actionMessage = 'Create a discussion to get started.';
  const welcomeMessage = isAddedParticipant
    ? "Welcome! You've been added to this meeting space."
    : 'Welcome to the meeting space!';
  const compositeMessage = `${welcomeMessage} ${actionMessage}`;

  return (
    <MeetingSpaceBanner>
      <InnerContainer>
        <Message>
          <Icon role="img" aria-label="Sparkles">✨</Icon>
          <MessageText>{compositeMessage}</MessageText>
        </Message>
        <StartDiscussionButton meetingId={meetingId} />
      </InnerContainer>
    </MeetingSpaceBanner>
  );
};

NewMeetingSpaceBanner.propTypes = {
  isAddedParticipant: PropTypes.bool.isRequired,
  meetingId: PropTypes.string.isRequired,
};

export default NewMeetingSpaceBanner;
