import gql from 'graphql-tag';

export default gql`
  mutation AddDocumentParticipant($id: String!, $user: Object!, $accessType: String!) {
    addDocumentParticipant(id: $id, user: $user, accessType: $accessType) @client
  }
`;
