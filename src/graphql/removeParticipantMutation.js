import gql from 'graphql-tag';

export default gql`
  mutation RemoveParticipant($id: String!) {
    removeParticipant(id: $id, userId: $userId) @rest(type: "Success", path: "/meetings/{args.id}/access?user_id={args.userId}", method: "DELETE") {
      success
    }
  }
`;
