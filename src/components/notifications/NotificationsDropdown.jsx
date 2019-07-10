import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import styled from '@emotion/styled';

const Container = styled.div(({ iconDimensions, isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
  // The parent container is center aligned, so the left margin is half the modal width only
  marginLeft: iconDimensions.width ? `${-175 + (iconDimensions.width / 2)}px` : '0',
  marginTop: iconDimensions.height ? `${iconDimensions.height + 10}px` : '0',
  position: 'absolute',
  width: '350px',
  zIndex: 1000,
}));

class NotificationsDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event) {
    const { isOpen, handleCloseDropdown } = this.props;

    if (isOpen) handleCloseDropdown(event);
  }

  render() {
    const { iconDimensions, isOpen, notifications, unreadCount } = this.props;

    return (
      <Container iconDimensions={iconDimensions} isOpen={isOpen}>Hello</Container>
    );
  }
}

NotificationsDropdown.propTypes = {
  iconDimensions: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  notifications: PropTypes.array,
  handleCloseDropdown: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
};

NotificationsDropdown.defaultProps = {
  notifications: null, // This lets us know it's still loading
  unreadCount: null,
};

export default onClickOutside(NotificationsDropdown);
