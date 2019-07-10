import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as solidBell } from '@fortawesome/free-solid-svg-icons';
import { faBell as regularBell } from '@fortawesome/free-regular-svg-icons';
import styled from '@emotion/styled';

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

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown(event) {
    event.stopPropagation();

    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    // TODO: Mark notifications as read
  }

  render() {
    const { isOpen } = this.state;

    return (
      <StyledIcon
        icon={isOpen ? solidBell : regularBell}
        onMouseDown={this.toggleDropdown}
      />
    );
  }
}

NotificationSystem.propTypes = {
};

export default NotificationSystem;
