import gql from 'graphql-tag';

export default gql`
  query MeetingConversation($meetingId: String!, $conversationId: String!) {
    conversation(meetingId: $meetingId, conversationId: $conversationId) @rest(type: "Conversation", path: "/meetings/{args.meetingId}/conversations/{args.conversationId}", method: "GET") {
      id
      author @type(name: "Author") {
        id
        fullName
        profilePictureUrl
      }
      createdAt
      messages @type(name: "[Message]") {
        id
        author @type(name: "Author") {
          id
        }
        createdAt
        body @type(name: "Body") {
          formatter
          payload
        }
      }
    }
  }
`;
