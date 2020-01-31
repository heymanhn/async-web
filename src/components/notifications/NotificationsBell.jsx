import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import NotificationsDropdown from './NotificationsDropdown';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
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
  const newNotifications = notifications && notifications.length;

  function handleShowDropdown() {
    setIsDropdownVisible(true);
  }

  function handleCloseDropdown() {
    setIsDropdownVisible(false);
  }

  return (
    <>
      <Container onClick={handleShowDropdown}>
        <StyledIcon icon={faBell} />
        {newNotifications ? <UnreadBadge /> : undefined}
      </Container>
      <NotificationsDropdown
        isOpen={isDropdownVisible}
        notifications={notifications}
        handleCloseDropdown={handleCloseDropdown}
      />
    </>
  );
};

NotificationsBell.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default NotificationsBell;
