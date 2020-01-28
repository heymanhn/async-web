import gql from 'graphql-tag';

import message from './message';

export default gql`
  fragment MessageContext on Discussion {
    messageCount
    lastMessages @type(name: "[Message]") {
      ...MessageObject
    }
  }
  ${message}
`;
