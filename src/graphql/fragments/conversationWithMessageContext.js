import gql from 'graphql-tag';

import conversation from './conversation';
import conversationMessage from './conversationMessage';

export default gql`
  fragment ConversationWithMessageContext on Conversation {
    ...ConversationObject
    messageCount
    lastMessage @type(name: "Message") {
      ...ConversationMessage
    }
  }
  ${conversation}
  ${conversationMessage}
`;
