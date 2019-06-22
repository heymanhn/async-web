import gql from 'graphql-tag';

export default gql`
  query ConversationMessages($id: String!) {
    conversationMessagesQuery(id: $id) @rest(type: "Messages", path: "/conversations/{args.id}/messages", method: "GET") {
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
