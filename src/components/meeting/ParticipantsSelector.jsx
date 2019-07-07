import React from 'react';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div({
  background: '#fff',
  border: '1px solid #000',
  borderBottom: 'none',
  width: '300px',
  zIndex: 1000,
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

const TestContainer = styled.div({
  background: '#fff',
  border: '1px solid #000',
  borderTop: 'none',
  marginLeft: '-1px',
  position: 'absolute',
  width: '300px',
});

const ParticipantsSelector = ({ participants }) => (
  <Container>
    <Title>PARTICIPANTS</Title>
    {participants.map(p => (
      <StyledAvatar key={p.id} src={p.profilePictureUrl} size={30} alt={p.fullName} />
    ))}
    <TestContainer>
      <div>Hello</div>
      <div>Hello</div>
      <div>Hello</div>
    </TestContainer>
  </Container>
);

ParticipantsSelector.propTypes = {};

export default ParticipantsSelector;
