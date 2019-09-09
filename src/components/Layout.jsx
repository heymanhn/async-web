/* eslint react-hooks/exhaustive-deps: 0 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled';

import mediaBreakpointQuery from 'graphql/queries/mediaBreakpoint';
import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import getBreakpoint from 'utils/mediaQuery';

import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

import Sidebar from 'components/navigation/Sidebar';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const Content = styled.div({
  width: '100%',
});

const Layout = ({ children }) => {
  const client = useApolloClient();
  const { isLoggedIn } = client.readQuery({ query: isLoggedInQuery });

  useEffect(() => {
    function handleWindowSizeChange() {
      const { mediaBreakpoint } = client.readQuery({ query: mediaBreakpointQuery });

      const newBreakpoint = getBreakpoint();
      if (newBreakpoint !== mediaBreakpoint) {
        client.writeData({ data: { mediaBreakpoint: newBreakpoint } });
      }
    }

    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <Theme>
      <GlobalStyles />
      <Container>
        {isLoggedIn && <Sidebar />}
        <Content>
          {children}
        </Content>
      </Container>
    </Theme>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
