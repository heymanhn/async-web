import React from 'react';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import organizationQuery from 'graphql/queries/organization';
import { getLocalUser } from 'utils/auth';

// NOTE TO ARUN: We need a default avatar if the URL provided by backend
// doesn't resolve
import defaultAvatar from 'images/icons/default-avatar.png';

import Avatar from 'components/shared/Avatar';
import MeetingSpacesList from './MeetingSpacesList';
import SwitchToButton from './SwitchToButton';

const Container = styled.div(({ theme: { colors } }) => ({
  flexShrink: 0,
  background: colors.darkBlue,
  minHeight: '100vh',
  width: '250px',
}));

const OrganizationDisplay = styled.div({
  display: 'flex',
  flexDirection: 'row',

  margin: '25px 20px 0',
});

const OrganizationLogo = styled(Avatar)({
  marginRight: '15px',
});

const OrganizationTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.bgGrey,
  fontSize: '16px',
  fontWeight: 500,
}));

const Sidebar = () => {
  const { organizationId } = getLocalUser();
  const [getOrganization, { loading, data }] = useLazyQuery(organizationQuery, {
    variables: { id: organizationId },
  });

  if (!organizationId) return null;
  if (organizationId && !data) {
    getOrganization();
    return null;
  }

  if (loading || !data.organization) return null;
  const { title } = data.organization; // TODO: Use the logo

  return (
    <Container>
      <OrganizationDisplay>
        <OrganizationLogo
          size={24}
          square
          src={defaultAvatar}
        />
        <OrganizationTitle>{title}</OrganizationTitle>
      </OrganizationDisplay>

      {/* Placeholder button row for now */}
      <SwitchToButton />

      <MeetingSpacesList />
    </Container>
  );
};

export default Sidebar;
