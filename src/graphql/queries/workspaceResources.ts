import gql from 'graphql-tag';

import resourceItems from 'graphql/fragments/resourceItems';

export default gql`
  query WorkspaceResources($workspaceId: String!, $queryParams: Object!) {
    workspaceResources(workspaceId: $workspaceId, queryParams: $queryParams)
      @rest(
        type: "ResourcesResponse"
        path: "/workspaces/{args.workspaceId}/resources?{args.queryParams}"
        method: "GET"
      ) {
      ...ResourceItems
    }
  }
  ${resourceItems}
`;
