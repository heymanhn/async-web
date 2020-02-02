import gql from 'graphql-tag';

export default gql`
  mutation UpdateBadgeCount($userId: String!, $notification: Object!) {
    updateBadgeCount(userId: $userId, notification: $notification) @client
  }
`;