import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import mediaBreakpointQuery from 'graphql/mediaBreakpointQuery';
import getBreakpoint from 'utils/mediaQuery';

import NavBar from 'components/navigation/NavBar';
import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

const Container = styled.div({});

const Footer = styled.footer(({ theme: { colors, mq } }) => ({
  background: colors.bgGrey,
  color: colors.formPlaceholderGrey,
  fontSize: '14px',
  padding: '30px',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  [mq('tabletUp')]: {
    flexDirection: 'row',
  },
}));

const Copyright = styled.div({});

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
    const { children, hideFooter, meetingId, mode, title } = this.props;

    // Prevent vertical scrolling on a meeting space page
    // https://medium.com/react-camp/how-to-fight-the-body-scroll-2b00267b37ac
    if (meetingId) document.body.style = 'overflow: hidden';

    return (
      <Theme>
        <GlobalStyles />
        <Container>
          <NavBar
            meetingId={meetingId}
            mode={mode}
            title={title}
          />
          {children}
          {!hideFooter && (
            <Footer>
              <Copyright>Copyright © Roval</Copyright>
            </Footer>
          )}
        </Container>
      </Theme>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  hideFooter: PropTypes.bool,
  meetingId: PropTypes.string,
  mode: PropTypes.oneOf(['normal', 'wide']),
  title: PropTypes.string,
};

Layout.defaultProps = {
  hideFooter: false,
  meetingId: null,
  mode: 'normal',
  title: '',
};

export default withApollo(Layout);
