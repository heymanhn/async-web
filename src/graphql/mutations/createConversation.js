import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import message from 'graphql/fragments/message';

export default gql`
  mutation CreateConversation($id: String!, $input: Object!) {
    createConversation(id: $id, input: $input) @rest(type: "Conversation", path: "/meetings/{args.id}/conversations", method: "POST") {
      ...ConversationObject
      messages @type(name: "Message") {
        ...MessageObject
      }
    }
  }
  ${conversation}
  ${message}
`;
