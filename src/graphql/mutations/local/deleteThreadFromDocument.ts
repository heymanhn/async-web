import gql from 'graphql-tag';

export default gql`
  mutation DeleteThreadFromDocument(
    $documentId: String!
    $threadId: String!
  ) {
    deleteThreadFromDocument(
      documentId: $documentId
      threadId: $threadId
    ) @client
  }
`;
