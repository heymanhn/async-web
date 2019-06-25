import gql from 'graphql-tag';

export default gql`
  mutation CreateMeeting($input: Object!) {
    createMeeting(input: $input) @rest(type: "Meeting", path: "/meetings", method: "POST") {
      id
    }
  }
`;
