import gql from 'graphql-tag';

export default gql`
  mutation DeleteDiscussion($discussionId: String!) {
    deleteDiscussion(discussionId: $discussionId) @rest(type: "DeleteDiscussionResponse", path: "/discussions/{args.discussionId}", method: "DELETE") {
      success
    }
  }
`;
