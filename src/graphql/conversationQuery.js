import gql from 'graphql-tag';

export default gql`
  query Conversation($conversationId: String!) {
    conversation(conversationId: $conversationId) @rest(type: "Conversation", path: "/conversations/{args.conversationId}", method: "GET") {
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
