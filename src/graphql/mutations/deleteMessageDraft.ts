import gql from 'graphql-tag';

export default gql`
  mutation DeleteMessageDraft($discussionId: String!) {
    deleteMessageDraft(discussionId: $discussionId)
      @rest(
        type: "MessageDraft"
        path: "/discussions/{args.discussionId}/drafts"
        method: "DELETE"
      ) {
      success
    }
  }
`;
