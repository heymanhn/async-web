import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/react-hooks';

import organizationQuery from 'graphql/queries/organization';
import { getLocalAppState } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import DropdownMenu from 'components/navigation/DropdownMenu';

const Container = styled.div({});

const Display = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const AvatarContainer = styled.div({
  width: '40px',
});

const OrganizationAvatar = styled(Avatar)({
  cursor: 'pointer',
});

const OrganizationTitle = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  color: colors.grey0,
  cursor: 'pointer',
}));

const OrganizationSettings = props => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openDropdown = () => setIsDropdownOpen(true);
  const closeDropdown = () => setIsDropdownOpen(false);

  const { organizationId } = getLocalAppState();
  const { loading, data } = useQuery(organizationQuery, {
    variables: { id: organizationId },
    skip: !organizationId,
  });

  if (loading || !data || !data.organization) return null;
  const { logo, title } = data.organization;

  return (
    <Container {...props}>
      <Display>
        <AvatarContainer>
          <OrganizationAvatar
            avatarUrl={logo}
            size={24}
            square
            onClick={openDropdown}
          />
        </AvatarContainer>
        <OrganizationTitle onClick={openDropdown}>{title}</OrganizationTitle>
      </Display>
      <DropdownMenu
        handleClose={closeDropdown}
        isOpen={isDropdownOpen}
        organizationId={organizationId}
      />
    </Container>
  );
};

export default OrganizationSettings;
