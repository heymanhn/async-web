import React, { useContext, useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import { getLocalUser } from 'utils/auth';
import { NavigationContext } from 'utils/contexts';

import NotificationsDropdown from './NotificationsDropdown';

const Container = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  cursor: 'pointer',
  margin: '0 15px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '20px',

  ':hover': {
    color: colors.grey1,
  },
}));

const UnreadBadge = styled.div(({ theme: { colors } }) => ({
  background: colors.blue,
  borderRadius: '10px',
  marginTop: '-12px',
  marginLeft: '-10px',
  width: '12px',
  height: '12px',
}));

const NotificationsBell = () => {
  const iconRef = useRef(null);
  const { userId } = getLocalUser();
  const { resource } = useContext(NavigationContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  let { resourceType, resourceId } = resource || {};
  if (!resource) {
    resourceType = 'user';
    resourceId = userId;
  }

  const { data } = useQuery(resourceNotificationsQuery, {
    variables: { resourceType: Pluralize(resourceType), resourceId },
  });

  if (!data || !data.resourceNotifications) return null;

  const { notifications } = data.resourceNotifications;
  const unreadNotifications = (notifications || []).filter(n => n.readAt < 0);

  function findIconWidth() {
    const icon = iconRef.current;
    return icon ? icon.offsetWidth : null;
  }

  function handleShowDropdown() {
    setIsDropdownVisible(true);
  }

  // The notification rows need to wait until the dropdown is closed before
  // it performs a navigate, that's what the callback method is for
  // TODO (HN): this isn't true. You can close the dropdown before the navigate.
  function handleCloseDropdown(callback = () => {}) {
    setIsDropdownVisible(false);
    callback();
  }

  return (
    <>
      <Container onClick={handleShowDropdown} ref={iconRef}>
        <StyledIcon icon="bell" />
        {unreadNotifications.length ? <UnreadBadge /> : undefined}
      </Container>
      {notifications && (
        <NotificationsDropdown
          isOpen={isDropdownVisible}
          notifications={notifications}
          iconWidth={findIconWidth()}
          handleCloseDropdown={handleCloseDropdown}
        />
      )}
    </>
  );
};

export default NotificationsBell;
