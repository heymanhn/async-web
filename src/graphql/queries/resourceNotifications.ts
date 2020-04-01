import gql from 'graphql-tag';

import notification from 'graphql/fragments/notification';

export default gql`
  query Notifications($id: String!) {
    userNotifications(id: $id)
      @rest(
        type: "NotificationsResponse"
        path: "/users/{args.id}/notifications"
        method: "GET"
      ) {
      notifications @type(name: "Notification") {
        ...NotificationObject
      }
    }
  }
  ${notification}
`;
