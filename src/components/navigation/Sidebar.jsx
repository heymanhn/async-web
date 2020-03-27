import React, { useState } from 'react';
import styled from '@emotion/styled';

import { NavigationContext, DEFAULT_NAVIGATION_CONTEXT } from 'utils/contexts';

import OrganizationSettings from 'components/navigation/OrganizationSettings';
import WorkspacesList from './WorkspacesList';

const Container = styled.div(({ theme: { colors, sidebarWidth } }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: colors.bgGrey,
  borderRight: `1px solid ${colors.borderGrey}`,
  overflowX: 'hidden',
  overflowY: 'scroll',
  position: 'fixed',
  top: 0,
  bottom: 0,
  width: sidebarWidth,
  zIndex: 1,
}));

const StyledOrganizationSettings = styled(OrganizationSettings)({
  margin: '18px 20px 0',
});

const Sidebar = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const value = {
    ...DEFAULT_NAVIGATION_CONTEXT,
    isInviteModalOpen,
    setIsInviteModalOpen,
  };

  return (
    <NavigationContext.Provider value={value}>
      <Container>
        <StyledOrganizationSettings />
        <WorkspacesList />
      </Container>
    </NavigationContext.Provider>
  );
};

export default Sidebar;
