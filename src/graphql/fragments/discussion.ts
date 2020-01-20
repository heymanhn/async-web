import gql from 'graphql-tag';

import body from 'graphql/fragments/body';

export default gql`
  fragment DiscussionObject on Discussion {
    id
    title
    documentId
    author @type(name: "Author") {
      id
      fullName
      profilePictureUrl
    }
    createdAt
    updatedAt
    tags
    status @type(name: "DiscussionStatus") {
      author @type(name: "Author") {
        id
        fullName
        profilePictureUrl
      }
      state
      updatedAt
    }
    draft @type(name: "ReplyDraft") {
      body @type(name: "Body") {
        ...BodyObject
      }
    }
    topic @type(name: "Body") {
      ...BodyObject
    }
  }
  ${body}
`;
