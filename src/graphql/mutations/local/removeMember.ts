import gql from 'graphql-tag';

export default gql`
  mutation RemoveMember(
    $resourceType: String!
    $resourceId: String!
    $userId: String!
  ) {
    removeMember(
      resourceType: $resourceType
      resourceId: $resourceId
      userId: $userId
    ) @client
  }
`;
