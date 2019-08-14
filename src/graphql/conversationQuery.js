import gql from 'graphql-tag';

export default gql`
  query Conversation($meetingId: String!, $conversationId: String!) {
    conversation(meetingId: $meetingId, conversationId: $conversationId) @rest(type: "Conversation", path: "/meetings/{args.meetingId}/conversations/{args.conversationId}", method: "GET") {
      id
      author @type(name: "Author") {
        id
        fullName
        profilePictureUrl
      }
      createdAt
      updatedAt
      meetingId
      unreadCounts @type(name: "[UnreadCount]") {
        userId
        count
      }
    }
  }
`;
