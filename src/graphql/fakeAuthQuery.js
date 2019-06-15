import gql from 'graphql-tag';

export default gql`
  query FakeAuth($email: String!) {
    user(email: $email) @rest(type: "User", path: "/accounts/login?email={args.email}") {
      id
      token
    }
  }
`;
