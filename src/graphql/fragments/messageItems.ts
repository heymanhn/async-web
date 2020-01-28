import gql from 'graphql-tag';

import message from './message';

export default gql`
  fragment MessageItems on MessagesResponse {
    items @type(name: "MessageItem") {
      message @type(name: "Message") {
        ...MessageObject
        tags
      }
    }
    replyCount
    pageToken
  }
  ${message}
`;
