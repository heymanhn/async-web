import React from 'react';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ theme: { colors } }) => ({
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '-15px',
  marginRight: '20px',
  outline: 'none',
  padding: '15px',
  width: '320px',
  zIndex: 1000,

  ':hover,:focus': {
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    // borderBottom: 'none',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
    padding: '14px',
  },
}));

const ParticipantsDisplay = styled.div({
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const StyledAvatar = styled(Avatar)({
  display: 'inline-block',
  marginRight: '-4px',
});

// Temporary
const TestContainer = styled.div({
  background: '#fff',
  // border: '1px solid #000',
  borderTop: 'none',
  marginLeft: '-1px',
  position: 'absolute',
  width: '320px',
});

const ParticipantsSelector = ({ participants }) => (
  <Container tabIndex={0}>
    <ParticipantsDisplay>
      <Title>PARTICIPANTS</Title>
      {participants.map(p => (
        <StyledAvatar key={p.id} src={p.profilePictureUrl} size={30} alt={p.fullName} />
      ))}
    </ParticipantsDisplay>
    {/* Put the participants in the test container */}
    <TestContainer />
  </Container>
);

ParticipantsSelector.propTypes = {};

export default ParticipantsSelector;
