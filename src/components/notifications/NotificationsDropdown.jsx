import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import styled from '@emotion/styled';

import NotificationRow from './NotificationRow';

const Container = styled.div(({ iconWidth, isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
  marginLeft: iconWidth ? `${-350 + iconWidth}px` : '0',
  marginTop: '10px',
  maxHeight: `${window.innerHeight - 80}px`,
  overflow: 'scroll',
  position: 'absolute',
  width: '350px',
  zIndex: 1000,
}));

const TitleSection = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '15px',
  position: 'sticky',
  top: '0px',
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
}));

const UnreadCountBadge = styled.div(({ theme: { colors } }) => ({
  background: colors.blue,
  borderRadius: '5px',
  color: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  marginLeft: '8px',
  padding: '0px 8px',
}));

class NotificationsDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event) {
    const { isOpen, handleCloseDropdown } = this.props;
    event.stopPropagation();

    if (isOpen) handleCloseDropdown();
  }

  render() {
    const { handleCloseDropdown, iconWidth, isOpen, notifications, unreadCount } = this.props;

    return (
      <Container iconWidth={iconWidth} isOpen={isOpen}>
        <TitleSection>
          <Title>NOTIFICATIONS</Title>
          {unreadCount > 0 && <UnreadCountBadge>{unreadCount}</UnreadCountBadge>}
        </TitleSection>
        {!notifications && <div>Loading...</div>}
        {notifications && notifications.map(n => (
          <NotificationRow
            key={n.createdAt}
            notification={n}
            handleCloseDropdown={handleCloseDropdown}
          />
        ))}
      </Container>
    );
  }
}

NotificationsDropdown.propTypes = {
  iconWidth: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  notifications: PropTypes.array,
  handleCloseDropdown: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
};

NotificationsDropdown.defaultProps = {
  iconWidth: null,
  notifications: null, // This lets us know it's still loading
  unreadCount: null,
};

export default onClickOutside(NotificationsDropdown);
