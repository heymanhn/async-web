import gql from 'graphql-tag';

export default gql`
  mutation RemoveParticipant($id: String!, $userId: String!) {
    removeParticipant(id: $id, userId: $userId) @rest(type: "Success", path: "/documents/{args.id}/access?user_id={args.userId}", method: "DELETE") {
      success
    }
  }
`;
