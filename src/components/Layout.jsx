/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { Query, withApollo } from 'react-apollo';
import { Link } from '@reach/router';
import styled from '@emotion/styled';

import isLoggedInQuery from 'graphql/isLoggedInQuery';
import mediaBreakpointQuery from 'graphql/mediaBreakpointQuery';
import getBreakpoint from 'utils/mediaQuery';

import LoggedOutNavBar from 'components/navigation/LoggedOutNavBar';
import NavBar from 'components/navigation/NavBar';
import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const Content = styled.div({
  flexGrow: 1,
});

const Footer = styled.footer(({ theme: { colors, mq } }) => ({
  color: colors.formPlaceholderGrey,
  fontSize: '14px',
  margin: '30px',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  [mq('tabletUp')]: {
    flexDirection: 'row',
  },
}));

const Copyright = styled.div(({ theme: { colors, mq } }) => ({
  [mq('tabletUp')]: {
    borderRight: `1px solid ${colors.borderGrey}`,
    paddingRight: '20px',
  },
}));

const Links = styled.div({
  display: 'flex',
  justifyContent: 'center',
  padding: '0px 10px',
});

const StyledLink = styled(Link)(({ theme: { colors } }) => ({
  color: colors.blue,
  textDecoration: 'none',
  ':hover': {
    color: colors.blue,
    textDecoration: 'none',
  },
  margin: '0px 10px',
}));

class Layout extends Component {
  constructor(props) {
    super(props);

    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange() {
    const { client } = this.props;
    const { mediaBreakpoint } = client.readQuery({ query: mediaBreakpointQuery });

    const newBreakpoint = getBreakpoint();
    if (newBreakpoint !== mediaBreakpoint) {
      client.writeData({ data: { mediaBreakpoint: newBreakpoint } });
    }
  }

  render() {
    const { children } = this.props;

    return (
      <Query query={isLoggedInQuery}>
        {({ data }) => (
          <Theme>
            <GlobalStyles />
            <Container>
              {data.isLoggedIn ? <NavBar /> : <LoggedOutNavBar />}
              <Content>
                {children}
              </Content>
              <Footer>
                <Copyright>Copyright © Nexus</Copyright>
                <Links>
                  <StyledLink to="/privacy">Privacy Policy</StyledLink>
                  <StyledLink to="/terms">Terms of Use</StyledLink>
                </Links>
              </Footer>
            </Container>
          </Theme>
        )}
      </Query>
    );
  }
}

export default withApollo(Layout);
