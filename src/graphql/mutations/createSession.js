import gql from 'graphql-tag';

export default gql`
  mutation CreateSession($input: Object!) {
    createSession(input: $input) @rest(type: "Session", path: "/accounts/login", method: "POST") {
      id
      token
      fullName
      organizationId
    }
  }
`;
