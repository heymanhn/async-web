import gql from 'graphql-tag';

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
  }
`;
