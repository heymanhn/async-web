import gql from 'graphql-tag';

export default gql`
  mutation RemoveFromWorkspace($resource: Object!) {
    removeFromWorkspace(resource: $resource) @client
  }
`;
