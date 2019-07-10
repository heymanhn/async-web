import React from 'react';
import { Query } from 'react-apollo';
import { Link } from '@reach/router';
import styled from '@emotion/styled';

import logo from 'images/logo.png';
import isLoggedInQuery from 'graphql/isLoggedInQuery';

import AvatarDropdown from './AvatarDropdown';
import CreateMeetingButton from './CreateMeetingButton';

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
  color: colors.grey6,
  fontSize: '14px',
  fontWeight: 400,
  marginLeft: '20px',
  position: 'relative',
  top: '2px',
}));

const ErrorIndicator = styled.span(({ theme: { colors } }) => ({
  background: colors.errorRed,
  borderRadius: '25px',
  color: colors.white,
  fontSize: '13px',
  fontWeight: 400,
  marginLeft: '20px',
  padding: '4px 10px',
}));

const LoggedInMenu = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: '25px',
  margin: '0 15px 0 17px',
}));

const NavBar = () => (
  <Query query={isLoggedInQuery}>
    {({ data }) => (
      <NavigationBar>
        <Container>
          <div>
            <Link to="/inbox">
              <LogoImage
                src={logo}
                alt="Roval logo"
                title="Roval"
              />
            </Link>
            <LogoTitle>Roval</LogoTitle>
            {data.saveStatus === 'success' && <SavedIndicator>Saved!</SavedIndicator>}
            {data.saveStatus === 'error' && <ErrorIndicator>Failed to save</ErrorIndicator>}
          </div>
          {data.isLoggedIn && (
            <LoggedInMenu>
              <AvatarDropdown />
              <VerticalDivider />
              <CreateMeetingButton />
            </LoggedInMenu>
          )}
        </Container>
      </NavigationBar>
    )}
  </Query>
);

export default NavBar;
