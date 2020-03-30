import gql from 'graphql-tag';

export default gql`
  mutation AddResourceToWorkspace($workspaceId: String!, $input: Object!) {
    addResourceToWorkspace(workspaceId: $workspaceId, input: $input)
      @rest(
        type: "AddResourceToWorkspace"
        path: "/workspaces/{args.workspaceId}/resource"
        method: "POST"
      ) {
      success
    }
  }
`;
