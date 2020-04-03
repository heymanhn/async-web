import gql from 'graphql-tag';

export default gql`
  mutation UpdateDocumentTitle($documentId: String!, $title: String!) {
    updateDocumentTitle(documentId: $documentId, title: $title) @client
  }
`;
