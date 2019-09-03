import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';

export default gql`
  mutation CreateConversationMessage($conversationId: String!, $input: Object!) {
    createConversationMessage(conversationId: $conversationId, input: $input) @rest(type: "Message", path: "/conversations/{args.conversationId}/messages", method: "POST") {
      ...ConversationMessageObject
    }
  }
  ${conversationMessage}
`;
