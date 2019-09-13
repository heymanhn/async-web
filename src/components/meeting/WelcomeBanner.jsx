/* eslint jsx-a11y/accessible-emoji: 0 */
import React from 'react';
import styled from '@emotion/styled';

import { MeetingSpaceBanner } from 'styles/shared';

const StyledMeetingSpaceBanner = styled(MeetingSpaceBanner)({
  marginBottom: '30px',
});

const MessageContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '15px 30px',
});

const Icon = styled.span({
  fontSize: '24px',
  fontWeight: 500,
  marginRight: '10px',
});

const MessageText = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
}));

const WelcomeBanner = () => (
  <StyledMeetingSpaceBanner>
    <MessageContainer>
      <Icon role="img" aria-label="Hand-wave">👋</Icon>
      <MessageText>
        Welcome! You’ve been added to this meeting space.
      </MessageText>
    </MessageContainer>
  </StyledMeetingSpaceBanner>
);

export default WelcomeBanner;
