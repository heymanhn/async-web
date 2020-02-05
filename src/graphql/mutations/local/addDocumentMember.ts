import gql from 'graphql-tag';

export default gql`
  mutation AddDocumentMember($id: String!, $user: Object!, $accessType: String!) {
    addDocumentMember(id: $id, user: $user, accessType: $accessType) @client
  }
`;
