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

  const newNotifications = notifications && notifications.length;

  function findIconWidth() {
    const icon = iconRef.current;
    return icon ? icon.offsetWidth : null;
  }

  function handleShowDropdown() {
    setIsDropdownVisible(true);
  }

  function handleCloseDropdown() {
    setIsDropdownVisible(false);
  }

  return (
    <div>
      <Container onClick={handleShowDropdown} ref={iconRef}>
        <StyledIcon icon={faBell} />
        {newNotifications ? <UnreadBadge /> : undefined}
      </Container>
      <NotificationsDropdown
        isOpen={isDropdownVisible}
        notifications={notifications}
        iconWidth={findIconWidth()}
        handleCloseDropdown={handleCloseDropdown}
      />
    </div>
  );
};

NotificationsBell.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default NotificationsBell;
