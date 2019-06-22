import gql from 'graphql-tag';

export default gql`
  mutation CreateConversationMessage($id: String!, $input: Object!) {
    createConversationMessage(id: $id, input: $input) @rest(type: "Message", path: "/conversations/{args.id}/messages", method: "POST") {
      id
      author
      body @type(name: "Body") {
        formatter
        payload
      }
      createdAt
    }
  }
`;
