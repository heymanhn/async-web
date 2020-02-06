import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

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

const NotificationsBell = ({ notifications }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const iconRef = useRef(null);

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
        <StyledIcon icon={faBell} />
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

NotificationsBell.propTypes = {
  notifications: PropTypes.array,
};

NotificationsBell.defaultProps = {
  notifications: [],
};

export default NotificationsBell;