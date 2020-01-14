import gql from 'graphql-tag';

export default gql`
  mutation AddParticipant($id: String!, $input: Object!) {
    addParticipant(id: $id, input: $input) @rest(type: "Success", path: "/meetings/{args.id}/access", method: "POST") {
      success
    }
  }
`;