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

const OrganizationAvatar = styled(Avatar)({
  cursor: 'pointer',
});

const OrganizationTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey0,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  paddingLeft: '15px',
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
        <OrganizationAvatar
          avatarUrl={logo}
          size={24}
          square
          onClick={openDropdown}
        />
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
