import gql from 'graphql-tag';

export default gql`
  mutation UpdateDiscussion($documentId: String!, $discussionId: String!, $input: Object!) {
    updateDiscussion(documentId: $documentId, discussionId: $discussionId, input: $input) @rest(type: "Discussion", path: "/documents/{args.documentId}/discussions/{args.discussionId}", method: "PUT") {
      id
    }
  }
`;
