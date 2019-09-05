import gql from 'graphql-tag';

import message from 'graphql/fragments/message';

export default gql`
  mutation CreateMessage($conversationId: String!, $input: Object!) {
    createMessage(conversationId: $conversationId, input: $input) @rest(type: "Message", path: "/conversations/{args.conversationId}/messages", method: "POST") {
      ...MessageObject
    }
  }
  ${message}
`;
