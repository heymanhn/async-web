import gql from 'graphql-tag';

export default gql`
  fragment MessageObject on Message {
    id
    author @type(name: "Author") {
      id
      fullName
      profilePictureUrl
    }
    createdAt
    updatedAt
    body @type(name: "Body") {
      formatter
      payload
      text
    }
    conversationId
    meetingId
  }
`;
