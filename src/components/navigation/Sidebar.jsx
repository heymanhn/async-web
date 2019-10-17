import React from 'react';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import organizationQuery from 'graphql/queries/organization';
import { getLocalAppState } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import Button from 'components/shared/Button';
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

const OrganizationDisplay = styled.div({
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

// Temporary UI
const SignOutButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',

  background: colors.darkBlue,
  position: 'sticky',
  bottom: '0px',
  padding: '20px',
}));

const StyledButton = styled(Button)({
  padding: '3px 15px',
});

const Sidebar = () => {
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
      <OrganizationDisplay>
        <OrganizationAvatar
          avatarUrl={logo}
          size={24}
          square
        />
        <OrganizationTitle>{title}</OrganizationTitle>
      </OrganizationDisplay>

      {/* Placeholder button row for now */}
      <SwitchToButton />

      <MeetingSpacesList />

      {/* NOTE: Temporary buttons here */}
      <SignOutButtonContainer>
        <StyledButton
          onClick={() => navigate(`/organizations/${organizationId}/invites`)}
          title="Send invites"
          type="grey"
        />
        <StyledButton
          onClick={() => navigate('/logout')}
          title="Sign out"
          type="grey"
        />
      </SignOutButtonContainer>
    </Container>
  );
};

export default Sidebar;
