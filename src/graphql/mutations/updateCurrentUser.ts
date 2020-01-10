import gql from 'graphql-tag';

export default gql`
  mutation UpdateCurrentUser($id: String!, $input: Object!) {
    updateCurrentUser(id: $id, input: $input) @rest(type: "User", path: "/users/{args.id}", method: "PUT") {
      id
      notificationReadTime
    }
  }
`;
