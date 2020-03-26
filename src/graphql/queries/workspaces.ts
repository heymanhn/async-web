import gql from 'graphql-tag';

import workspace from 'graphql/fragments/workspace';

export default gql`
  query Workspaces($id: String!, $queryParams: Object!) {
    workspaces(id: $id, queryParams: $queryParams)
      @rest(type: "Workspaces", path: "/users/{args.id}/workspaces?{args.queryParams}") {
      items @type(name: "WorkspaceItem") {
        workspace @type(name: "Workspace") {
          ...WorkspaceObject
        }
      }
      totalHits
      pageToken
    }
  }
  ${workspace}
`;
