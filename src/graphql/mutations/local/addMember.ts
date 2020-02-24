import gql from 'graphql-tag';

export default gql`
  mutation AddMember(
    $resourceType: string!
    $id: String!
    $user: Object!
    $accessType: String!
  ) {
    addMember(
      resourceType: $resourceType
      id: $id
      user: $user
      accessType: $accessType
    ) @client
  }
`;
