import gql from 'graphql-tag';

export default gql`
  mutation AddToWorkspace($workspaceId: String!, $input: Object!) {
    addToWorkspace(workspaceId: $workspaceId, input: $input)
      @rest(
        type: "AddToWorkspace"
        path: "/workspaces/{args.workspaceId}/resource"
        method: "POST"
      ) {
      success
    }
  }
`;
