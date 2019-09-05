import gql from 'graphql-tag';

import message from 'graphql/fragments/message';

export default gql`
  mutation UpdateMessage($conversationId: String!, $messageId: String!, $input: Object!) {
    updateMessage(conversationId: $conversationId, messageId: $messageId, input: $input) @rest(type: "Message", path: "/conversations/{args.conversationId}/messages/{args.messageId}", method: "PUT") {
      ...MessageObject
    }
  }
  ${message}
`;
