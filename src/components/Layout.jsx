import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import mediaBreakpointQuery from 'graphql/mediaBreakpointQuery';
import getBreakpoint from 'utils/mediaQuery';

import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

const Container = styled.div({});

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
      <Theme>
        <GlobalStyles />
        <Container>
          {children}
        </Container>
      </Theme>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withApollo(Layout);
