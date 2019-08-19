import gql from 'graphql-tag';

export default gql`
  query ConversationMessages($id: String!, $queryParams: Object!) {
    conversationMessages(id: $id, queryParams: $queryParams) @rest(type: "Messages", path: "/conversations/{args.id}/messages?{args.queryParams}", method: "GET") {
      items @type(name: "[Item]") {
        message @type(name: "Message") {
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
          }
          conversationId
          childConversationId
          replyCount
        }
      }
      messageCount
      pageToken
    }
  }
`;
