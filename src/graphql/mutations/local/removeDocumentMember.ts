import gql from 'graphql-tag';

export default gql`
  mutation RemoveDocumentMember($id: String!, $userId: String!) {
    removeDocumentMember(id: $id, userId: $userId) @client
  }
`;
