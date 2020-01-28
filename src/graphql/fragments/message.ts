import gql from 'graphql-tag';

import body from './body';
import user from './user';

export default gql`
  fragment MessageObject on Message {
    id
    author @type(name: "User") {
      ...UserObject
    }
    body @type(name: "Body") {
      ...BodyObject
    }
    createdAt
    updatedAt
    discussionId
  }
  ${body}
  ${user}
`;
