import gql from 'graphql-tag';

import workspace from 'graphql/fragments/workspace';

export default gql`
  mutation UpdateWorkspace($workspaceId: String!, $input: Object!) {
    updateWorkspace(workspaceId: $workspaceId, input: $input)
      @rest(
        type: "Workspace"
        path: "/workspaces/{args.workspaceId}"
        method: "PUT"
      ) {
      ...WorkspaceObject
    }
  }
  ${workspace}
`;
