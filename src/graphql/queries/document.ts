import gql from 'graphql-tag';

import doc from 'graphql/fragments/document';

export default gql`
  query Document($documentId: String!) {
    document(documentId: $documentId)
      @rest(
        type: "Document"
        path: "/documents/{args.documentId}"
        method: "GET"
      ) {
      ...DocumentObject
      reactions @type(name: "Reaction") {
        ...ReactionObject
      }
    }
  }
  ${doc}
`;
