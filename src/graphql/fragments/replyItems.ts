import gql from 'graphql-tag';

import reply from './reply';

export default gql`
  fragment ReplyItems on RepliesResponse {
    items @type(name: "ReplyItem") {
      reply @type(name: "Reply") {
        ...ReplyObject
        tags
      }
    }
    replyCount
    pageToken
  }
  ${reply}
`;
