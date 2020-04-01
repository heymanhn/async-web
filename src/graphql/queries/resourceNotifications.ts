import gql from 'graphql-tag';

import notification from 'graphql/fragments/notification';

export default gql`
  query ResourceNotifications($resourceType: String!, $resourceId: String!) {
    resourceNotifications(resourceType: $resourceType, resourceId: $resourceId)
      @rest(
        type: "NotificationsResponse"
        path: "/{args.resourceType}/{args.resourceId}/notifications"
        method: "GET"
      ) {
      notifications @type(name: "Notification") {
        ...NotificationObject
      }
    }
  }
  ${notification}
`;
