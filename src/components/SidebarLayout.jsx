import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import localStateQuery from 'graphql/queries/localState';
import { NavigationContext, DEFAULT_NAVIGATION_CONTEXT } from 'utils/contexts';

import Sidebar from 'components/navigation/Sidebar';

const Container = styled.div({});

const Content = styled.div(({ theme: { sidebarWidth } }) => ({
  marginLeft: sidebarWidth,
}));

const SidebarLayout = ({ children }) => {
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const { data } = useQuery(localStateQuery);

  // If visiting the /logout query directly, don't render the sidebar
  const { pathname } = window.location;
  if (pathname === '/logout') return children;

  const { isLoggedIn, isOnboarding } = data || {};
  if (!isLoggedIn || isOnboarding) return children;

  const value = {
    ...DEFAULT_NAVIGATION_CONTEXT,
    selectedResourceId,
    setSelectedResourceId,
  };
  return (
    <NavigationContext.Provider value={value}>
      <Container>
        <Sidebar />
        <Content>{children}</Content>
      </Container>
    </NavigationContext.Provider>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SidebarLayout;
