import gql from 'graphql-tag';

export default gql`
  mutation CreateConversation($id: String!, $input: Object!) {
    createConversation(id: $id, input: $input) @rest(type: "Conversation", path: "/meetings/{args.id}/conversations", method: "POST") {
      id
      title
      author
      createdAt
      messages @type(name: "[Message]") {
        id
        author
        createdAt
        body @type(name: "Body") {
          formatter
          payload
        }
      }
    }
  }
`;
