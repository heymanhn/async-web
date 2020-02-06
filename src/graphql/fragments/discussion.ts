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
    tags
    status @type(name: "DiscussionStatus") {
      author @type(name: "User") {
        ...UserObject
      }
      state
      updatedAt
    }
    draft @type(name: "MessageDraft") {
      body @type(name: "Body") {
        ...BodyObject
      }
    }
    topic @type(name: "Body") {
      ...BodyObject
    }
  }
  ${body}
  ${user}
`;
