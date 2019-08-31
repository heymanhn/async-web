import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';

export default gql`
  mutation UpdateConversationMessage($id: String!, $mid: String!, $input: Object!) {
    updateConversationMessage(id: $id, mid: $mid, input: $input) @rest(type: "Message", path: "/conversations/{args.id}/messages/{args.mid}", method: "PUT") {
      ...ConversationMessageObject
    }
  }
  ${conversationMessage}
`;
