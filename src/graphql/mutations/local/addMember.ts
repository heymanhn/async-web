import gql from 'graphql-tag';

export default gql`
  mutation AddMember(
    $resourceType: string!
    $resourceId: String!
    $user: Object!
    $accessType: String!
  ) {
    addMember(
      resourceType: $resourceType
      resourceId: $resourceId
      user: $user
      accessType: $accessType
    ) @client
  }
`;
