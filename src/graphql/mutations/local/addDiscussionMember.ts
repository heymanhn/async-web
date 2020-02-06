import gql from 'graphql-tag';

export default gql`
  mutation AddDiscussionMember($id: String!, $user: Object!, $accessType: String!) {
    addDiscussionMember(id: $id, user: $user, accessType: $accessType) @client
  }
`;
