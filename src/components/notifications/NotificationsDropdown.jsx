import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ iconWidth, isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
  marginLeft: iconWidth ? `${-350 + iconWidth}px` : '0',
  marginTop: '8px',
  position: 'absolute',
  width: '350px',
  zIndex: 1000,
}));

const NotificationsDropdown = ({ iconWidth, isOpen, notifications, notificationReadTime }) => {
  return (
    <Container iconWidth={iconWidth} isOpen={isOpen}>Hello</Container>
  );
};

NotificationsDropdown.propTypes = {
  iconWidth: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  notifications: PropTypes.array,
  notificationReadTime: PropTypes.number,
};

NotificationsDropdown.defaultProps = {
  iconWidth: null,
  notifications: null, // This lets us know it's still loading
  notificationReadTime: null,
};

export default NotificationsDropdown;
