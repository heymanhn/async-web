import React from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import organizationQuery from 'graphql/queries/organization';
import { getLocalUser } from 'utils/auth';

// NOTE TO ARUN: We need a default avatar if the URL provided by backend
// doesn't resolve
import defaultAvatar from 'images/icons/default-avatar.png';

import Avatar from 'components/shared/Avatar';
import MeetingSpacesList from './MeetingSpacesList';

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
  const { loading, data } = useQuery(organizationQuery, {
    variables: { id: organizationId },
  });

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
      <MeetingSpacesList />
    </Container>
  );
};

export default Sidebar;
