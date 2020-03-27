import gql from 'graphql-tag';

import workspace from 'graphql/fragments/workspace';

export default gql`
  query Workspaces($userId: String!, $queryParams: Object!) {
    workspaces(userId: $userId, queryParams: $queryParams)
      @rest(
        type: "Workspaces"
        path: "/users/{args.userId}/workspaces?{args.queryParams}"
      ) {
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
