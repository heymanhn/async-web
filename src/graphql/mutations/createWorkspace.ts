import gql from 'graphql-tag';

export default gql`
  mutation CreateWorkspace($input: Object!) {
    createWorkspace(input: $input)
      @rest(type: "Workspace", path: "/workspaces", method: "POST") {
      id
    }
  }
`;
