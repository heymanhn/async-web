import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import conversationMessage from 'graphql/fragments/conversationMessage';

export default gql`
  mutation CreateConversation($id: String!, $input: Object!) {
    createConversation(id: $id, input: $input) @rest(type: "Conversation", path: "/meetings/{args.id}/conversations", method: "POST") {
      ...ConversationObject
      messages @type(name: "[Message]") {
        ...ConversationMessage
      }
    }
  }
  ${conversation}
  ${conversationMessage}
`;
