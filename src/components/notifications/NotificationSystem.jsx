// HN Notes
// This component needs to have an idea of whether there are unread notifications
// Meaning it should make the API call of fetching notifications

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as solidBell } from '@fortawesome/free-solid-svg-icons';
import { faBell as regularBell } from '@fortawesome/free-regular-svg-icons';
import styled from '@emotion/styled';

import NotificationsDropdown from './NotificationsDropdown';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '20px',
  margin: '0 10px',
}));

class NotificationSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.iconRef = React.createRef();
    this.getIconWidth = this.getIconWidth.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  getIconWidth() {
    const icon = this.iconRef.current;
    return icon ? icon.offsetWidth : null;
  }

  toggleDropdown(event) {
    event.stopPropagation();

    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    // TODO: Mark notifications as read
  }

  render() {
    const { isOpen } = this.state;
    const notifications = []; // temporary
    const notificationReadTime = 0;

    return (
      <div ref={this.iconRef}>
        <StyledIcon
          icon={isOpen ? solidBell : regularBell}
          onMouseDown={this.toggleDropdown}
        />
        <NotificationsDropdown
          isOpen={isOpen}
          notifications={notifications}
          notificationReadTime={notificationReadTime}
          iconWidth={this.getIconWidth()}
        />
      </div>
    );
  }
}

NotificationSystem.propTypes = {
};

export default NotificationSystem;
