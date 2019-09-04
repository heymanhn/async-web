import gql from 'graphql-tag';

export default gql`
  mutation DeleteConversationMessage($conversationId: String!, $messageId: String!) {
    deleteConversationMessage(conversationId: $conversationId, messageId: $messageId) @rest(type: "DeleteMessageResponse", path: "/conversations/{args.conversationId}/messages/{args.messageId}", method: "DELETE") {
      success
    }
  }
`;
