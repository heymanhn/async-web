import gql from 'graphql-tag';

export default gql`
  mutation RemoveResourceFromWorkspace(
    $workspaceId: String!
    $queryParams: Object!
  ) {
    removeResourceFromWorkspace(
      workspaceId: $workspaceId
      queryParams: $queryParams
    )
      @rest(
        type: "RemoveResourceFromWorkspace"
        path: "/workspaces/{args.workspaceId}/resource?{args.queryParams}"
        method: "DELETE"
      ) {
      success
    }
  }
`;
