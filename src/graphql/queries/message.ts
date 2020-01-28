import gql from 'graphql-tag';

import message from 'graphql/fragments/message';
import reaction from 'graphql/fragments/reaction';

export default gql`
  query Message($discussionId: String!, $messageId: String!) {
    message(discussionId: $discussionId, messageId: $messageId) @rest(type: "Message", path: "/discussions/{args.discussionId}/messages/{args.messageId}", method: "GET") {
      ...MessageObject
      reactions @type(name: "Reaction") {
         ...ReactionObject
      }
    }
  }
  ${message}
  ${reaction}
`;
