import gql from 'graphql-tag';

import reply from './reply';

export default gql`
  fragment ReplyContext on Discussion {
    replyCount
    lastReply @type(name: "Reply") {
      ...ReplyObject
    }
  }
  ${reply}
`;
