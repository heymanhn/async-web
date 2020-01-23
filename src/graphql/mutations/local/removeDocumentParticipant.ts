import gql from 'graphql-tag';

export default gql`
  mutation RemoveDocumentParticipant($id: String!, $participantId: String!) {
    removeDocumentParticipant(id: $id, participantId: $participantId) @client
  }
`;
