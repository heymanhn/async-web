import gql from 'graphql-tag';

export default gql`
  mutation UpdateNotifications($userId: String!, $notification: Object!) {
    updateNotifications(userId: $userId, notification: $notification) @client
  }
`;