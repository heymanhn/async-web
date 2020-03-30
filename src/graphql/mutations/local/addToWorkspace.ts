import gql from 'graphql-tag';

export default gql`
  mutation AddToWorkspace($resource: Object!, $workspaceId: String!) {
    addToWorkspace(resource: $resource, workspaceId: $workspaceId) @client
  }
`;
