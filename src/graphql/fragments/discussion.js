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
    draft @type(name: "ReplyDraft") {
      body @type(name: "Body") {
        ...BodyObject
      }
    }
  }
  ${body}
`;
