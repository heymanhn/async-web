import gql from 'graphql-tag';

import body from 'graphql/fragments/body';
import user from 'graphql/fragments/user';

export default gql`
  fragment DiscussionObject on Discussion {
    id
    documentId
    author @type(name: "User") {
      ...UserObject
    }
    createdAt
    updatedAt
    status @type(name: "DiscussionStatus") {
      author @type(name: "User") {
        ...UserObject
      }
      state
      updatedAt
    }
    topic @type(name: "Body") {
      ...BodyObject
    }
  }
  ${body}
  ${user}
`;
