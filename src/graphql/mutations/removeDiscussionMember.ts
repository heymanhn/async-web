import gql from 'graphql-tag';

export default gql`
  mutation RemoveDiscussionMember($id: String!, $userId: String!) {
    removeDiscussionMember(id: $id, userId: $userId) @rest(type: "Success", path: "/discussions/{args.id}/access?user_id={args.userId}", method: "DELETE") {
      success
    }
  }
`;
