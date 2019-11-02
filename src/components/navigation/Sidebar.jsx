import React, { useState } from 'react';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import organizationQuery from 'graphql/queries/organization';
import { getLocalAppState } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import DropdownMenu from './DropdownMenu';
import MeetingSpacesList from './MeetingSpacesList';
import SwitchToButton from './SwitchToButton';

const Container = styled.div(({ theme: { colors, sidebarWidth } }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: colors.darkBlue,
  overflowX: 'hidden',
  overflowY: 'scroll',
  position: 'fixed',
  top: 0,
  bottom: 0,
  width: sidebarWidth,
  zIndex: 1,
}));

const MenuContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const OrganizationDisplay = styled.div({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',

  margin: '25px 20px 0',
});

const OrganizationAvatar = styled(Avatar)({
  marginRight: '15px',
});

const OrganizationTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.bgGrey,
  fontSize: '16px',
  fontWeight: 500,
}));

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  function openDropdown() { setIsDropdownOpen(true); }
  function closeDropdown() { setIsDropdownOpen(false); }

  const { organizationId } = getLocalAppState();
  const [getOrganization, { loading, data }] = useLazyQuery(organizationQuery, {
    variables: { id: organizationId },
  });

  if (!organizationId) return null;
  if (organizationId && !data) {
    getOrganization();
    return null;
  }

  if (loading || !data.organization) return null;
  const { title, logo } = data.organization;

  return (
    <Container>
      <MenuContainer>
        <OrganizationDisplay>
          <OrganizationAvatar
            avatarUrl={logo}
            onClick={openDropdown}
            size={24}
            square
          />
          <OrganizationTitle onClick={openDropdown}>{title}</OrganizationTitle>
        </OrganizationDisplay>

        <DropdownMenu
          handleClose={closeDropdown}
          isOpen={isDropdownOpen}
          organizationId={organizationId}
        />
      </MenuContainer>
      {/* Placeholder button row for now */}
      <SwitchToButton />

      <MeetingSpacesList />
    </Container>
  );
};

export default Sidebar;
