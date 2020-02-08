import gql from 'graphql-tag';

export default gql`
  mutation AddMember($objectType: string!, $id: String!, $user: Object!, $accessType: String!) {
    addMember(objectType: $objectType, id: $id, user: $user, accessType: $accessType) @client
  }
`;
