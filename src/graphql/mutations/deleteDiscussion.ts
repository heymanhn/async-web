import gql from 'graphql-tag';

export default gql`
  mutation DeleteDiscussion($documentId: String!, $discussionId: String!) {
    deleteDiscussion(documentId: $documentId, discussionId: $discussionId) @rest(type: "DeleteDiscussionResponse", path: "/documents/{args.documentId}/discussions/{args.discussionId}", method: "DELETE") {
      success
    }
  }
`;
