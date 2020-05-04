import gql from 'graphql-tag';

import message from 'graphql/fragments/message';
import reaction from 'graphql/fragments/reaction';

export default gql`
  query Message($messageId: String!) {
    message(messageId: $messageId)
      @rest(
        type: "Message"
        path: "/messages/{args.messageId}"
        method: "GET"
      ) {
      ...MessageObject
      reactions @type(name: "Reaction") {
        ...ReactionObject
      }
    }
  }
  ${message}
  ${reaction}
`;
