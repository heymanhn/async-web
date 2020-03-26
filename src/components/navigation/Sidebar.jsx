import React from 'react';
import styled from '@emotion/styled';

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
  return (
    <Container>
      <StyledOrganizationSettings />
      <WorkspacesList />
    </Container>
  );
};

export default Sidebar;
