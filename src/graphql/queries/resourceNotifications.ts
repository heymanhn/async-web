import gql from 'graphql-tag';

import notification from 'graphql/fragments/notification';

export default gql`
  query ResourceNotifications($resourceType: String!, $resourceId: String!, $queryParams: Object!) {
    resourceNotifications(resourceType: $resourceType, resourceId: $resourceId, queryParams: $queryParams)
      @rest(
        type: "NotificationsResponse"
        path: "/{args.resourceType}/{args.resourceId}/notifications?{args.queryParams}"
        method: "GET"
      ) {
      items @type(name: "Notification") {
        ...NotificationObject
      }
      pageToken
    }
  }
  ${notification}
`;
