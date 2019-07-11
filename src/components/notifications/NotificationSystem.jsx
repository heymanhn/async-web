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
import updateCurrentUserMutation from 'graphql/updateCurrentUserMutation';
import { getLocalUser } from 'utils/auth';

import NotificationsDropdown from './NotificationsDropdown';

const IconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
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
    const { userId } = getLocalUser();

    this.state = {
      badgeDismissed: false,
      isOpen: false,
      notifications: null,
      unreadCount: 0,
      userId,
    };

    this.iconRef = React.createRef();
    this.fetchNotificationData = this.fetchNotificationData.bind(this);
    this.findIconWidth = this.findIconWidth.bind(this);
    this.handleCloseDropdown = this.handleCloseDropdown.bind(this);
    this.markNotificationsAsRead = this.markNotificationsAsRead.bind(this);
    this.prepUnreadNotifications = this.prepUnreadNotifications.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    this.fetchNotificationData();
  }

  async fetchNotificationData() {
    const { client } = this.props;
    const { userId } = this.state;

    const response = await client.query({ query: notificationsQuery, variables: { id: userId } });
    if (!response.data) return;

    const { notificationsQuery: query } = response.data;
    const notifications = query ? query.notifications : [];

    this.prepUnreadNotifications(notifications);
  }

  // Reconfigure the data for each notification for the dropdown's benefit
  async prepUnreadNotifications(notifications) {
    const { client } = this.props;
    const { userId } = this.state;

    const response = await client.query({ query: currentUserQuery, variables: { id: userId } });
    if (!response.data) return;

    const { notificationReadTime } = response.data.user;
    const notificationsWithUnread = notifications.map(n => ({
      ...n,
      isUnread: n.createdAt > notificationReadTime,
    }));
    const unreadCount = notificationsWithUnread.filter(n => n.isUnread).length;
    this.setState({ notifications: notificationsWithUnread, unreadCount });
  }

  findIconWidth() {
    const icon = this.iconRef.current;
    return icon ? icon.offsetWidth : null;
  }

  // The notification rows need to wait until the dropdown is closed before
  // it performs a navigate, otherwise for some reason the whole app reloads.
  // That's what the callback method is for
  handleCloseDropdown(callback = () => { }) {
    const { isOpen, notifications } = this.state;
    if (isOpen) this.setState({ isOpen: false }, callback);
    this.prepUnreadNotifications(notifications);
  }

  toggleDropdown(event) {
    event.stopPropagation();
    const { badgeDismissed, isOpen } = this.state;

    this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    if (!isOpen) {
      this.markNotificationsAsRead();
      if (!badgeDismissed) this.setState({ badgeDismissed: true });
    }
  }

  markNotificationsAsRead() {
    const { client } = this.props;
    const { userId } = this.state;
    const timestamp = Math.floor(Date.now() / 1000);

    return client.mutate({
      mutation: updateCurrentUserMutation,
      variables: {
        id: userId,
        input: {
          notificationReadTime: timestamp,
        },
      },
      update: (cache) => {
        const { user } = cache.readQuery({ query: currentUserQuery, variables: { id: userId } });
        user.notificationReadTime = timestamp;
        cache.writeQuery({
          query: currentUserQuery,
          variables: { id: userId },
          data: { user },
        });
      },
    });
  }

  render() {
    const { badgeDismissed, isOpen, notifications, unreadCount } = this.state;

    return (
      <div>
        <IconContainer
          className="ignore-react-onclickoutside"
          onClick={this.toggleDropdown}
          ref={this.iconRef}
        >
          <StyledIcon icon={isOpen ? solidBell : regularBell} />
          {unreadCount > 0 && !badgeDismissed && <UnreadBadge />}
        </IconContainer>
        <NotificationsDropdown
          isOpen={isOpen}
          notifications={notifications}
          handleCloseDropdown={this.handleCloseDropdown}
          unreadCount={unreadCount}
          iconWidth={this.findIconWidth()}
        />
      </div>
    );
  }
}

NotificationSystem.propTypes = {
  client: PropTypes.object.isRequired,
};

export default withApollo(NotificationSystem);
