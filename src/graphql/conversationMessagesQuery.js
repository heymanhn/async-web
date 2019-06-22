import gql from 'graphql-tag';

export default gql`
  query ConversationMessages($id: String!) {
    conversationMessagesQuery(id: $id) @rest(type: "Messages", path: "/conversations/{args.id}/messages", method: "GET") {
      items @type(name: "[Item]") {
        message @type(name: "Message") {
          id
          author @type(name: "Author") {
            id
            fullName
            profilePictureUrl
          }
          createdAt
          body @type(name: "Body") {
            formatter
            payload
          }
        }
      }
    }
  }
`;
