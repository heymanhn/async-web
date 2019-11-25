/* eslint react-hooks/exhaustive-deps: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import localStateQuery from 'graphql/queries/localState';
import useMediaQuery from 'utils/hooks/useMediaQuery';

import GlobalStyles from 'components/style/GlobalStyles';
import Theme from 'components/style/Theme';

import Sidebar from 'components/navigation/Sidebar';

const Content = styled.div(({ showSidebar, theme: { sidebarWidth } }) => ({
  marginLeft: showSidebar ? sidebarWidth : 0,
}));

const Layout = ({ children }) => {
  const { data } = useQuery(localStateQuery);
  useMediaQuery();

  // TEMP CODE
  const isDocument = window.location.pathname.includes('/d/')

  let showSidebar = false;
  // Include an escape hatch to not render the sidebar if logging out
  if (data) {
    const { isLoggedIn, isOnboarding } = data;
    showSidebar = isLoggedIn
      && !isOnboarding
      && !isDocument
      && window.location.pathname !== '/logout';
  }

  return (
    <Theme>
      <GlobalStyles bgColor={isDocument ? 'white' : null} />
      <div>
        {showSidebar && <Sidebar />}
        <Content showSidebar={showSidebar}>
          {children}
        </Content>
      </div>
    </Theme>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
