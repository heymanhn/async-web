// HN Notes
// This component needs to have an idea of whether there are unread notifications
// Meaning it should make the API call of fetching notifications

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as solidBell } from '@fortawesome/free-solid-svg-icons';
import { faBell as regularBell } from '@fortawesome/free-regular-svg-icons';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import notificationsQuery from 'graphql/notificationsQuery';
import { getLocalUser } from 'utils/auth';

import NotificationsDropdown from './NotificationsDropdown';

const Container = styled.div({
  cursor: 'pointer',
});

const IconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '22px',
  margin: '0 10px',
}));

const UnreadBadge = styled.div(({ theme: { colors } }) => ({
  background: colors.blue,
  position: 'absolute',
  borderRadius: '10px',
  marginTop: '-8px',
  marginLeft: '8px',
  width: '12px',
  height: '12px',
}));

class NotificationSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      notifications: null,
      unreadCount: 0,
    };

    this.iconRef = React.createRef();
    this.fetchNotificationData = this.fetchNotificationData.bind(this);
    this.findIconWidth = this.findIconWidth.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    this.fetchNotificationData();
  }

  async fetchNotificationData() {
    const { client } = this.props;
    const { userId } = getLocalUser();

    const response1 = await client.query({ query: currentUserQuery, variables: { id: userId } });
    const response2 = await client.query({ query: notificationsQuery, variables: { id: userId } });

    if (!response1.data || !response2.data) return;

    // Reconfigure the data for each notification for the dropdown's benefit
    const { notificationReadTime } = response1.data.user;
    const { notificationsQuery: query } = response2.data;
    let notifications = query ? query.notifications : [];
    notifications = notifications.map(n => ({
      ...n,
      isUnread: n.createdAt > notificationReadTime,
    }));
    const unreadCount = notifications.filter(n => n.isUnread).length;
    this.setState({ notifications, unreadCount });
  }

  findIconWidth() {
    const icon = this.iconRef.current;
    return icon ? icon.offsetWidth : null;
  }

  toggleDropdown(event) {
    event.stopPropagation();
    // const { isOpen } = this.state;

    this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    // TODO: Mark notifications as read
  }

  render() {
    const { isOpen, notifications, unreadCount } = this.state;

    return (
      <Container>
        <IconContainer
          className="ignore-react-onclickoutside"
          onClick={this.toggleDropdown}
          ref={this.iconRef}
        >
          <StyledIcon icon={isOpen ? solidBell : regularBell} />
          {unreadCount > 0 && <UnreadBadge />}
        </IconContainer>
        <NotificationsDropdown
          isOpen={isOpen}
          notifications={notifications}
          handleCloseDropdown={this.toggleDropdown}
          unreadCount={unreadCount}
          iconWidth={this.findIconWidth()}
        />
      </Container>
    );
  }
}

NotificationSystem.propTypes = {
  client: PropTypes.object.isRequired,
};

export default withApollo(NotificationSystem);
