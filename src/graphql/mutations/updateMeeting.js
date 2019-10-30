import gql from 'graphql-tag';

import meeting from 'graphql/fragments/meeting';

export default gql`
  mutation UpdateMeeting($meetingId: String!, $input: Object!) {
    updateMeeting(meetingId: $meetingId, input: $input) @rest(type: "Meeting", path: "/meetings/{args.meetingId}", method: "PUT") {
      ...MeetingObject
    }
  }
  ${meeting}
`;
