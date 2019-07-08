import gql from 'graphql-tag';

export default gql`
  mutation RemoveParticipant($id: String!, $input: Object!) {
    removeParticipant(id: $id, input: $input) @rest(type: "Participant", path: "/meetings/{args.id}/access", method: "DELETE") {
      success
    }
  }
`;
