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
    )
      @rest(
        type: "Success"
        path: "/{args.resourceType}/{args.resourceId}/access?user_id={args.userId}"
        method: "DELETE"
      ) {
      success
    }
  }
`;
