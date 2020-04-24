// TODO(HN): is there a way to simplify or DRY up all these different nav bar
// components?
import React from 'react';
import { Link } from '@reach/router';
import styled from '@emotion/styled';

import logo from 'assets/grey-logo.png';

const Container = styled.div(({ theme: { bgColors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  background: bgColors.main,
  padding: '20px 30px 24px',
}));

const LogoContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Logo = styled.img({
  width: '36px',
  height: '36px',
  marginRight: '12px',
});

const Title = styled.span(({ theme: { textColors } }) => ({
  color: textColors.sub,
  fontSize: '16px',
  fontWeight: 500,
}));

const SignInLink = styled(Link)(({ theme: { textColors } }) => ({
  color: textColors.sub,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '-0.006em',
  textDecoration: 'none',

  ':hover,:active,:visited': {
    color: textColors.sub,
    textDecoration: 'none',
  },
}));

const NavBar = () => {
  return (
    <Container>
      <LogoContainer>
        <Logo src={logo} />
        <Title>Roval</Title>
      </LogoContainer>
      <SignInLink to="/login">Sign in</SignInLink>
    </Container>
  );
};

export default NavBar;
