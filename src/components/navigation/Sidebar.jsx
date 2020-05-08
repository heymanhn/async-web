import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';

import OrganizationSettings from './OrganizationSettings';
import AllUpdatesButton from './AllUpdatesButton';
import WorkspacesList from './WorkspacesList';
import RecentResourcesList from './RecentResourcesList';

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
  paddingBottom: '40px',
  zIndex: 1,
}));

const StyledOrganizationSettings = styled(OrganizationSettings)({
  margin: '18px 20px 0',
});

const Sidebar = () => {
  const navigationContext = useContext(NavigationContext);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [resourceCreationModalMode, setResourceCreationModalMode] = useState(
    null
  );

  const value = {
    ...navigationContext,
    isInviteModalOpen,
    resourceCreationModalMode,
    setIsInviteModalOpen,
    setResourceCreationModalMode,
  };

  return (
    <NavigationContext.Provider value={value}>
      <Container>
        <StyledOrganizationSettings />
        <AllUpdatesButton />
        <WorkspacesList />
        <RecentResourcesList />
      </Container>
    </NavigationContext.Provider>
  );
};

export default Sidebar;
