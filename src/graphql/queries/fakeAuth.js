import gql from 'graphql-tag';

export default gql`
  query FakeAuth($code: String!) {
    user(code: $code) @rest(type: "User", path: "/accounts/login?code={args.code}") {
      id
      token
      organizationId
    }
  }
`;
