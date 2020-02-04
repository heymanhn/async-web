import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { useQuery } from '@apollo/react-hooks';

import organizationQuery from 'graphql/queries/organization';
import notificationsQuery from 'graphql/queries/notifications';
import { getLocalAppState, getLocalUser } from 'utils/auth';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import DocumentAccessContainer from 'components/participants/DocumentAccessContainer';
import Avatar from 'components/shared/Avatar';
import VerticalDivider from 'components/shared/VerticalDivider';
import DropdownMenu from 'components/navigation/DropdownMenu';
import NotificationsBell from 'components/notifications/NotificationsBell';
import NewDocumentButton from 'components/document/NewDocumentButton';
import DocumentViewMode from 'components/document/DocumentViewMode';
import NavTitle from './NavTitle';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  background: colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  height: '54px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

const MenuSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: '30px',
  height: '100%',
});

const OrganizationAvatar = styled(Avatar)({
  cursor: 'pointer',
  marginRight: '15px',
});

const NavigationSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
});

const HeaderBar = ({ setViewMode, viewMode, ...props }) => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  function openDropdown() {
    setIsDropdownOpen(true);
  }
  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  const { organizationId } = getLocalAppState();
  const { userId } = getLocalUser();

  const { loading: loadingOrg, data: organizationData } = useQuery(
    organizationQuery,
    {
      variables: { id: organizationId },
    }
  );

  const { loading, data: notificationsData } = useQuery(notificationsQuery, {
    variables: { id: userId },
  });

  if (!organizationId) return null;
  if (loadingOrg || !organizationData.organization) return null;
  if (loading || !notificationsData.userNotifications) return null;

  const { logo } = organizationData.organization;
  const { notifications } = notificationsData.userNotifications;

  return (
    <Container {...props}>
      <MenuSection>
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
<<<<<<< HEAD:src/components/navigation/HeaderBar.jsx
        <NavTitle />
=======
        <NavTitle documentId={documentId} discussionId={discussionId} />
>>>>>>> saving some progress:src/components/navigation/HeaderBar.jsx
        {documentId && (
          <DocumentViewMode viewMode={viewMode} setViewMode={setViewMode} />
        )}
        <VerticalDivider />
        <DocumentAccessContainer />
      </MenuSection>
      <NavigationSection>
        <NotificationsBell notifications={notifications} />
        <NewDocumentButton />
      </NavigationSection>
    </Container>
  );
};

HeaderBar.propTypes = {
  setViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['content', 'discussions']).isRequired,
};

export default HeaderBar;
