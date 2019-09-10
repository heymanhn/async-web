/* eslint react-hooks/exhaustive-deps: 0 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import mediaBreakpointQuery from 'graphql/queries/mediaBreakpoint';
import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import getBreakpoint from 'utils/mediaQuery';

import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

import Sidebar from 'components/navigation/Sidebar';

const Container = styled.div({});

const Content = styled.div(({ showSidebar, theme: { sidebarWidth } }) => ({
  marginLeft: showSidebar ? sidebarWidth : 0,
}));

const Layout = ({ children }) => {
  const client = useApolloClient();
  const { data } = useQuery(isLoggedInQuery);

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

  let showSidebar = false;
  // Include an escape hatch to not render the sidebar if logging out
  if (data) showSidebar = data.isLoggedIn && window.location.pathname !== '/logout';

  return (
    <Theme>
      <GlobalStyles />
      <Container>
        {showSidebar && <Sidebar />}
        <Content showSidebar={showSidebar}>
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
