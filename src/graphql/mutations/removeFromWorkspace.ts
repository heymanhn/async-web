import gql from 'graphql-tag';

export default gql`
  mutation RemoveFromWorkspace($workspaceId: String!, $queryParams: Object!) {
    removeFromWorkspace(workspaceId: $workspaceId, queryParams: $queryParams)
      @rest(
        type: "RemoveFromWorkspace"
        path: "/workspaces/{args.workspaceId}/resources?{args.queryParams}"
        method: "DELETE"
      ) {
      success
    }
  }
`;
