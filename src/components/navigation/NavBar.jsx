import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Link } from '@reach/router';
import styled from '@emotion/styled';

import logo from 'images/logo.png';
import isLoggedInQuery from 'graphql/queries/isLoggedIn';

import NotificationSystem from 'components/notifications/NotificationSystem';
import MeetingProperties from 'components/meeting/MeetingProperties';
import AvatarDropdown from './AvatarDropdown';
import CreateMeetingSpaceButton from './CreateMeetingSpaceButton';

const NavigationBar = styled.div(({ theme: { colors } }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1049, // The modal windows are at z-index 1050

  background: colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  margin: '0px auto',
  width: '100%',
}));

const Container = styled.div(({ mode, theme: { maxViewport, wideViewport } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  // We'll care about custom media query dimensions later
  minHeight: '70px',
  maxWidth: mode === 'wide' ? wideViewport : maxViewport,

  margin: '0 auto',
  padding: '0 20px',

  a: {
    textDecoration: 'none',
    color: 'initial',

    ':hover, :visited, :active': {
      textDecoration: 'none',
      color: 'initial',
    },
  },
}));

const LeftContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const LogoImage = styled.img(({ theme: { mq } }) => ({
  height: '30px',
  width: 'auto',
  marginRight: '10px',

  [mq('tabletUp')]: {
    height: '36px',
    marginRight: '15px',
  },
}));

const Title = styled.div({
  fontSize: '18px',
  fontWeight: 500,
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
  margin: '0 10px',
}));

const NavBar = ({ meetingId, mode, title }) => (
  <Query query={isLoggedInQuery}>
    {({ data }) => (
      <NavigationBar>
        <Container mode={mode}>
          <LeftContainer>
            <Link to="/inbox">
              <LogoImage
                src={logo}
                alt="Roval logo"
                title="Roval"
              />
            </Link>
            <Title>{title}</Title>
            {meetingId && <MeetingProperties meetingId={meetingId} />}
            {data.saveStatus === 'success' && <SavedIndicator>Saved!</SavedIndicator>}
            {data.saveStatus === 'error' && <ErrorIndicator>Failed to save</ErrorIndicator>}
          </LeftContainer>
          {data.isLoggedIn && (
            <LoggedInMenu>
              <NotificationSystem />
              <CreateMeetingSpaceButton />
              <VerticalDivider />
              <AvatarDropdown />
            </LoggedInMenu>
          )}
        </Container>
      </NavigationBar>
    )}
  </Query>
);

NavBar.propTypes = {
  meetingId: PropTypes.string,
  mode: PropTypes.oneOf(['normal', 'wide']).isRequired,
  title: PropTypes.string.isRequired,
};

NavBar.defaultProps = {
  meetingId: null,
};

export default NavBar;
