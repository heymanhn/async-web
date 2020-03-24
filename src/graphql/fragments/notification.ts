import gql from 'graphql-tag';

import user from './user';

export default gql`
  fragment NotificationObject on Notification {
    userId
    objectId
    type
    author @type(name: "User") {
      ...UserObject
    }
    payload
    updatedAt
    readAt
  }
  ${user}
`;
