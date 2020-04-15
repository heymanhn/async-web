import gql from 'graphql-tag';

export default gql`
  mutation MarkNotificationAsRead($objectId: String!) {
    markNotificationAsRead(objectId: $objectId) @client
  }
`;
