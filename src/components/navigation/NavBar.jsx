import React from 'react';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import logo from 'images/logo.png';
import isLoggedInQuery from 'graphql/isLoggedInQuery';

import AvatarDropdown from './AvatarDropdown';

const NavigationBar = styled.div(({ theme: { colors } }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1000,

  background: colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,

  margin: '0px auto',
  padding: '0 20px',
  width: '100%',
}));

const Container = styled.div(({ theme: { maxViewport } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  // We'll care about custom media query dimensions later
  minHeight: '70px',
  maxWidth: maxViewport,

  margin: '0 auto',

  a: {
    textDecoration: 'none',
    color: 'initial',

    ':hover, :visited, :active': {
      textDecoration: 'none',
      color: 'initial',
    },
  },
}));

const LogoImage = styled.img(({ theme: { mq } }) => ({
  height: '30px',
  width: 'auto',
  marginRight: '10px',

  [mq('tabletUp')]: {
    height: '40px',
    marginRight: '15px',
  },
}));

const LogoTitle = styled.span({
  fontSize: '20px',
  fontWeight: 500,
  position: 'relative',
  top: '2px',
});

const SavedIndicator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey5,
  fontSize: '14px',
  fontWeight: 400,
  marginLeft: '20px',
  position: 'relative',
  top: '2px',
}));

const NavBar = () => (
  <Query query={isLoggedInQuery}>
    {({ data }) => (
      <NavigationBar>
        <Container>
          <div>
            <LogoImage
              src={logo}
              alt="async logo"
              title="async"
            />
            <LogoTitle>async</LogoTitle>
            {data.showSavedMessage && <SavedIndicator>Saved!</SavedIndicator>}
          </div>
          {data.isLoggedIn && <AvatarDropdown />}
        </Container>
      </NavigationBar>
    )}
  </Query>
);

export default NavBar;
