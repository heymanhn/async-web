import gql from 'graphql-tag';

export default gql`
  mutation DeleteDocument($documentId: String!) {
    deleteDocument(documentId: $documentId)
      @rest(
        type: "DeleteDocumentResponse"
        path: "/documents/{args.documentId}"
        method: "DELETE"
      ) {
      success
    }
  }
`;
