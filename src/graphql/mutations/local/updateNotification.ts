import gql from 'graphql-tag';

export default gql`
  mutation UpdateNotification(
    $resourceType: String!
    $resourceId: String!
    $notification: Object!
  ) {
    updateNotification(
      resourceType: $resourceType
      resourceId: $resourceId
      notification: $notification
    ) @client
  }
`;
