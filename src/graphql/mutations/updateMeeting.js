import gql from 'graphql-tag';

import meeting from 'graphql/fragments/meeting';

export default gql`
  mutation UpdateMeeting($id: String!, $input: Object!) {
    updateMeeting(id: $id, input: $input) @rest(type: "Meeting", path: "/meetings/{args.id}", method: "PUT") {
      ...MeetingObject
    }
  }
  ${meeting}
`;
