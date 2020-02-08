import gql from 'graphql-tag';

export default gql`
  mutation RemoveMember($objectType: String!, $id: String!, $userId: String!) {
    removeMember(objectType: $objectType, id: $id, userId: $userId) @client
  }
`;
