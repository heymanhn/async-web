import gql from 'graphql-tag';

import workspace from 'graphql/fragments/workspace';

export default gql`
  query Workspace($workspaceId: String!) {
    workspace(workspaceId: $workspaceId)
      @rest(
        type: "Workspace"
        path: "/workspaces/{args.workspaceId}"
        method: "GET"
      ) {
      ...WorkspaceObject
    }
  }
  ${workspace}
`;
