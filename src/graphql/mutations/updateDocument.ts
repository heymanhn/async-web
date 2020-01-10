import gql from 'graphql-tag';

export default gql`
  mutation UpdateDocument($documentId: String!, $input: Object!) {
    updateDocument(documentId: $documentId, input: $input) @rest(type: "Document", path: "/documents/{args.documentId}", method: "PUT") {
      id
    }
  }
`;
