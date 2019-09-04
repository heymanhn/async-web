import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';

export default gql`
  mutation UpdateConversationMessage($conversationId: String!, $messageId: String!, $input: Object!) {
    updateConversationMessage(conversationId: $conversationId, messageId: $messageId, input: $input) @rest(type: "Message", path: "/conversations/{args.conversationId}/messages/{args.messageId}", method: "PUT") {
      ...ConversationMessageObject
    }
  }
  ${conversationMessage}
`;
