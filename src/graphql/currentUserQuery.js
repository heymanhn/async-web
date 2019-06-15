import gql from 'graphql-tag';

export default gql`
  query CurrentUser($id: String!) {
    user(id: $id) @rest(type: "User", path: "/users/{args.id}") {
      id
      firstName
      lastName
      fullName
      email
      profilePictureUrl
    }
  }
`;
