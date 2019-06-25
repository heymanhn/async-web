import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  color: colors.grey3,
  fontSize: '26px',
  fontWeight: '400',
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
    color: colors.grey2,
  },

  span: {
    position: 'relative',
    top: '-2px',
  },
}));

const CreateMeetingButton = () => (
  <a href="meetings/new" target="_blank">
    <Container onClick={() => { }}>
      <span>+</span>
    </Container>
  </a>
);

export default CreateMeetingButton;
