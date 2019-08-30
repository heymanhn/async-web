import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';

export default gql`
  query ConversationMessage($conversationId: String!, $messageId: String!) {
    conversationMessage(conversationId: $conversationId, messageId: $messageId) @rest(type: "Message", path: "/conversations/{args.conversationId}/messages/{args.messageId}", method: "GET") {
      ...ConversationMessageObject
      reactions @type(name: "[Reaction]") {
        id
        code
        author @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
      }
    }
  }
  ${conversationMessage}
`;
