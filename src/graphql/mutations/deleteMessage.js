import gql from 'graphql-tag';

export default gql`
  mutation DeleteMessage($conversationId: String!, $messageId: String!) {
    deleteMessage(conversationId: $conversationId, messageId: $messageId) @rest(type: "DeleteMessageResponse", path: "/conversations/{args.conversationId}/messages/{args.messageId}", method: "DELETE") {
      success
    }
  }
`;
