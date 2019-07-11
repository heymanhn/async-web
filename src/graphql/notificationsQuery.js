import gql from 'graphql-tag';

export default gql`
  query Notifications($id: String!) {
    notificationsQuery(id: $id) @rest(type: "Notifications", path: "/users/{args.id}/notifications") {
      notifications @type(name: "[Notification]") {
        author @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
        createdAt
        title
        payload
      }
    }
  }
`;
