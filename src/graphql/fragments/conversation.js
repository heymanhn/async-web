import gql from 'graphql-tag';

import body from 'graphql/fragments/body';

export default gql`
  fragment ConversationObject on Conversation {
    id
    title
    meetingId
    author @type(name: "Author") {
      id
      fullName
      profilePictureUrl
    }
    createdAt
    updatedAt
    tags
    draft @type(name: "MessageDraft") {
      body @type(name: "Body") {
        ...BodyObject
      }
    }
  }
  ${body}
`;
