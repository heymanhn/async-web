import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  cursor: 'pointer',
  marginTop: '15px',
  padding: '8px 20px',

  ':hover': {
    background: colors.grey7,
  },
}));

const IconContainer = styled.div({
  width: '40px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '18px',
}));

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  marginTop: '1px',
}));

const AllUpdatesButton = () => {
  return (
    <Container>
      <IconContainer>
        <StyledIcon icon="bell" />
      </IconContainer>
      <Label>All Updates</Label>
    </Container>
  );
};

export default AllUpdatesButton;
