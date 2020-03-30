import gql from 'graphql-tag';

export default gql`
  mutation MarkWorkspaceResourceAsRead(
    $workspaceId: String!
    $resourceType: String!
    $resourceId: String!
  ) {
    markWorkspaceResourceAsRead(
      workspaceId: $workspaceId
      resourceType: $resourceType
      resourceId: $resourceId
    ) @client
  }
`;
