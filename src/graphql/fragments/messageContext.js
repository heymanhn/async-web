import gql from 'graphql-tag';

import message from './message';

export default gql`
  fragment MessageContext on Conversation {
    messageCount
    lastMessage @type(name: "Message") {
      ...MessageObject
    }
  }
  ${message}
`;
