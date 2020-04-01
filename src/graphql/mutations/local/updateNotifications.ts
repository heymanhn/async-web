import gql from 'graphql-tag';

export default gql`
  mutation UpdateNotifications(
    $resourceType: String!
    $resourceId: String!
    $notification: Object!
  ) {
    updateNotifications(
      resourceType: $resourceType
      resourceId: $resourceId
      notification: $notification
    ) @client
  }
`;
