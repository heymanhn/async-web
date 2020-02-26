import gql from 'graphql-tag';

export default gql`
  mutation DeleteDiscussionFromDocument(
    $documentId: String!
    $discussionId: String!
  ) {
    deleteDiscussionFromDocument(
      documentId: $documentId
      discussionId: $discussionId
    ) @client
  }
`;
