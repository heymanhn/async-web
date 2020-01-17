import gql from 'graphql-tag';

export default gql `
  query DocumentNotifications($id: String!) {
    documentNotifications(id: $id) @rest(type: "Notifications", path: "/documents/{args.id}/notifications", method: "GET") {
      notifications @type(name: "[Notification]") {
        author @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
        updatedAt
        title
        payload
      }
    }
  }
`;