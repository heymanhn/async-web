import gql from 'graphql-tag';

export default gql`
  mutation DeleteReply($discussionId: String!, $replyId: String!) {
    deleteReply(discussionId: $discussionId, replyId: $replyId) @rest(type: "DeleteReplyResponse", path: "/discussions/{args.discussionId}/replies/{args.replyId}", method: "DELETE") {
      success
    }
  }
`;
