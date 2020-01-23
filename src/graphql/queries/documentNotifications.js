import gql from 'graphql-tag';

import user from 'graphql/fragments/user';

export default gql`
  query DocumentNotifications($id: String!) {
    documentNotifications(id: $id) @rest(type: "Notifications", path: "/documents/{args.id}/notifications", method: "GET") {
      notifications @type(name: "[Notification]") {
        objectId
        userId
        author @type(name: "User") {
          ...UserObject
        }
        updatedAt
        title
        payload
      }
    }
  }
  ${user}
`;
