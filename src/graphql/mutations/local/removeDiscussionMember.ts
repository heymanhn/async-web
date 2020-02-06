import gql from 'graphql-tag';

export default gql`
  mutation RemoveDiscussionMember($id: String!, $userId: String!) {
    removeDiscussionMember(id: $id, userId: $userId) @client
  }
`;
