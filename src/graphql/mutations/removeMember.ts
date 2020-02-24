import gql from 'graphql-tag';

export default gql`
  mutation RemoveMember(
    $resourceType: String!
    $id: String!
    $userId: String!
  ) {
    removeMember(resourceType: $resourceType, id: $id, userId: $userId)
      @rest(
        type: "Success"
        path: "/{args.resourceType}/{args.id}/access?user_id={args.userId}"
        method: "DELETE"
      ) {
      success
    }
  }
`;
