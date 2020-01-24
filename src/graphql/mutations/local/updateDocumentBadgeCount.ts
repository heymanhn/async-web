import gql from 'graphql-tag';

export default gql`
  mutation UpdateDocumentBadgeCount($documentId: String!, $notification: Object!) {
    updateDocumentBadgeCount(documentId: $documentId, notification: $notification) @client
  }
`;