import gql from 'graphql-tag';

export default gql`
  mutation DeleteReplyDraft($discussionId: String!) {
    deleteReplyDraft(discussionId: $discussionId, input: $input) @rest(type: "ReplyDraft", path: "/discussions/{args.discussionId}/drafts", method: "DELETE") {
      success
    }
  }
`;
