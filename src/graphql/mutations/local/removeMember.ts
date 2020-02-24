import gql from 'graphql-tag';

export default gql`
  mutation RemoveMember(
    $resourceType: String!
    $id: String!
    $userId: String!
  ) {
    removeMember(resourceType: $resourceType, id: $id, userId: $userId) @client
  }
`;
