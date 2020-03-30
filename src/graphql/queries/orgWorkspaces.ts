import gql from 'graphql-tag';

import workspace from 'graphql/fragments/workspace';

export default gql`
  query OrgWorkspaces($queryParams: Object!) {
    orgWorkspaces(queryParams: $queryParams)
      @rest(
        type: "OrganizationWorkspaces"
        path: "/workspaces?{args.queryParams}"
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
