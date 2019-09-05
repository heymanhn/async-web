import gql from 'graphql-tag';

import message from 'graphql/fragments/message';

export default gql`
  query Message($conversationId: String!, $messageId: String!) {
    message(conversationId: $conversationId, messageId: $messageId) @rest(type: "Message", path: "/conversations/{args.conversationId}/messages/{args.messageId}", method: "GET") {
      ...MessageObject
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
  ${message}
`;
