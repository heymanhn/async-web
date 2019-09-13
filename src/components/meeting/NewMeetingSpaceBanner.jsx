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
  margin: '30px 0 40px',
});

const Message = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '10px',
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

const NewMeetingSpaceBanner = ({ meetingId }) => (
  <MeetingSpaceBanner>
    <InnerContainer>
      <Message>
        <Icon role="img" aria-label="Sparkles">✨</Icon>
        <MessageText>
          Welcome to the meeting space! Create a discussion to get started.
        </MessageText>
      </Message>
      <StartDiscussionButton meetingId={meetingId} />
    </InnerContainer>
  </MeetingSpaceBanner>
);

NewMeetingSpaceBanner.propTypes = {
  meetingId: PropTypes.string.isRequired,
};

export default NewMeetingSpaceBanner;
