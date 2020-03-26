import gql from 'graphql-tag';

import workspace from 'graphql/fragments/workspace';

export default gql`
  query Workspaces($queryParams: Object!) {
    workspaces(queryParams: $queryParams)
      @rest(type: "Workspaces", path: "/workspaces?{args.queryParams}") {
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
