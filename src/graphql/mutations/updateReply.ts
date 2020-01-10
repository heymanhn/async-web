import gql from 'graphql-tag';

import reply from 'graphql/fragments/reply';

export default gql`
  mutation UpdateReply($discussionId: String!, $replyId: String!, $input: Object!) {
    updateReply(discussionId: $discussionId, replyId: $replyId, input: $input) @rest(type: "Reply", path: "/discussions/{args.discussionId}/replies/{args.replyId}", method: "PUT") {
      ...ReplyObject
    }
  }
  ${reply}
`;
