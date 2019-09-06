import gql from 'graphql-tag';

import message from 'graphql/fragments/message';
import reaction from 'graphql/fragments/reaction';

export default gql`
  query Message($conversationId: String!, $messageId: String!) {
    message(conversationId: $conversationId, messageId: $messageId) @rest(type: "Message", path: "/conversations/{args.conversationId}/messages/{args.messageId}", method: "GET") {
      ...MessageObject
      reactions @type(name: "Reaction") {
         ...ReactionObject
      }
    }
  }
  ${message}
  ${reaction}
`;
