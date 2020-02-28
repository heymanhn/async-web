import gql from 'graphql-tag';

import doc from 'graphql/fragments/document';

export default gql`
  mutation UpdateDocument($documentId: String!, $input: Object!) {
    updateDocument(documentId: $documentId, input: $input)
      @rest(
        type: "Document"
        path: "/documents/{args.documentId}"
        method: "PUT"
      ) {
      ...DocumentObject
    }
  }
  ${doc}
`;
