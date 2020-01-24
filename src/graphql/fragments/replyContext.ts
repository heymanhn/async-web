import gql from 'graphql-tag';

import reply from './reply';

export default gql`
  fragment ReplyContext on Discussion {
    replyCount
    lastReplies @type(name: ["Reply"]) {
      ...ReplyObject
    }
  }
  ${reply}
`;
