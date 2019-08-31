import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';

export default gql`
  mutation CreateConversationMessage($id: String!, $input: Object!) {
    createConversationMessage(id: $id, input: $input) @rest(type: "Message", path: "/conversations/{args.id}/messages", method: "POST") {
      ...ConversationMessageObject
    }
  }
  ${conversationMessage}
`;
