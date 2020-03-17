import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/react-hooks';

import organizationQuery from 'graphql/queries/organization';
import { getLocalAppState } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import DropdownMenu from 'components/navigation/DropdownMenu';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const OrganizationAvatar = styled(Avatar)({
  cursor: 'pointer',
  marginRight: '15px',
});

const OrganizationSettings = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function openDropdown() {
    setIsDropdownOpen(true);
  }
  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  const { organizationId } = getLocalAppState();

  const { loading, data } = useQuery(organizationQuery, {
    variables: { id: organizationId },
    skip: !organizationId,
  });

  if (loading || !data.organization) return null;
  const { logo } = data.organization;

  return (
    <Container>
      <OrganizationAvatar
        avatarUrl={logo}
        onClick={openDropdown}
        size={24}
        square
      />
      <DropdownMenu
        handleClose={closeDropdown}
        isOpen={isDropdownOpen}
        organizationId={organizationId}
      />
    </Container>
  );
};

export default OrganizationSettings;
