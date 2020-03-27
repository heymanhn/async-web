import gql from 'graphql-tag';

export default gql`
  query CurrentUser($userId: String!) {
    user(userId: $userId) @rest(type: "User", path: "/users/{args.userId}") {
      id
      firstName
      lastName
      fullName
      email
      profilePictureUrl
      notificationReadTime
    }
  }
`;
