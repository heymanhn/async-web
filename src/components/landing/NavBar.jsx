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

const Title = styled.span(({ theme: { fontProps, textColors } }) => ({
  ...fontProps({ size: 16, weight: 500 }),
  color: textColors.sub,
}));

const SignInLink = styled(Link)(({ theme: { fontProps, textColors } }) => ({
  ...fontProps({ size: 14, weight: 600 }),

  color: textColors.sub,
  cursor: 'pointer',
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
        <Title>Candor</Title>
      </LogoContainer>
      <SignInLink to="/login">Sign in</SignInLink>
    </Container>
  );
};

export default NavBar;
