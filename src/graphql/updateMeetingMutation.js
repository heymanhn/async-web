import gql from 'graphql-tag';

export default gql`
  mutation UpdateMeeting($id: String!, $input: Object!) {
    updateMeeting(id: $id, input: $input) @rest(type: "Meeting", path: "/meetings/{args.id}", method: "PUT") {
      id
      title
      body @type(name: "[Body]") {
        formatter
        payload
      }
    }
  }
`;
