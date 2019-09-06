import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '2px 20px 5px',
}));

const PlusSign = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '18px',
  fontWeight: 500,
  marginRight: '6px',
}));

const ButtonLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
}));

const StartDiscussionButton = () => {
  return (
    <Container onClick={() => {}}>
      <PlusSign>+</PlusSign>
      <ButtonLabel>Start a discussion</ButtonLabel>
    </Container>
  );
};

export default StartDiscussionButton;
