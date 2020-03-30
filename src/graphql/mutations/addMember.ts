import gql from 'graphql-tag';

export default gql`
  mutation AddMember(
    $resourceType: String!
    $resourceId: String!
    $input: Object!
  ) {
    addMember(
      resourceType: $resourceType
      resourceId: $resourceId
      input: $input
    )
      @rest(
        type: "AddResourceMember"
        path: "/{args.resourceType}/{args.resourceId}/access"
        method: "POST"
      ) {
      success
    }
  }
`;
