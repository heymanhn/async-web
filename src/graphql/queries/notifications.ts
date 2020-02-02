import gql from 'graphql-tag';

export default gql`
  query Notifications($id: String!) {
    userNotifications(id: $id) @rest(type: "Notifications", path: "/users/{args.id}/notifications", method: "GET") {
      notifications @type(name: "[Notification]") {
        author @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
        updatedAt
        readAt
        type
        payload
      }
    }
  }
`;