import gql from 'graphql-tag';

export default gql`
  mutation UpdateConversationMessage($id: String!, $mid: String!, $input: Object!) {
    updateConversationMessage(id: $id, mid: $mid, input: $input) @rest(type: "Message", path: "/conversations/{args.id}/messages/{args.mid}", method: "PUT") {
      id
      conversationId
      author @type(name: "Author") {
        id
        fullName
        profilePictureUrl
      }
      body @type(name: "Body") {
        formatter
        payload
      }
      createdAt
    }
  }
`;
