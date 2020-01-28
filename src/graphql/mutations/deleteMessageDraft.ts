import gql from 'graphql-tag';

export default gql`
  mutation DeleteMessageDraft($discussionId: String!) {
    deleteMessageDraft(discussionId: $discussionId, input: $input) @rest(type: "MessageDraft", path: "/discussions/{args.discussionId}/drafts", method: "DELETE") {
      success
    }
  }
`;
