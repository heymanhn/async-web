import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/react-hooks';

import { getLocalUser } from 'utils/auth';
import notificationsQuery from 'graphql/queries/notifications';

import NotificationsDropdown from './NotificationsDropdown';

const Container = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  cursor: 'pointer',
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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const iconRef = useRef(null);
  const { userId } = getLocalUser();

  const { loading, data } = useQuery(notificationsQuery, {
    variables: { id: userId },
  });

  if (loading || !data.userNotifications) return null;

  const { notifications } = data.userNotifications;
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
  function handleCloseDropdown(callback = () => {}) {
    setIsDropdownVisible(false);
    callback();
  }

  return (
    <div>
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
    </div>
  );
};

export default NotificationsBell;
