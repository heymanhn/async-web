import gql from 'graphql-tag';

export default gql`
  mutation CreateUser($input: Object!) {
    createUser(input: $input) @rest(type: "User", path: "/users", method: "POST") {
      id
      token
      organizationId
    }
  }
`;
