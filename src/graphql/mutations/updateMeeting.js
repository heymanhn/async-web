import gql from 'graphql-tag';

import meetingSpace from 'graphql/fragments/meetingSpace';

export default gql`
  mutation UpdateMeeting($id: String!, $input: Object!) {
    updateMeeting(id: $id, input: $input) @rest(type: "Meeting", path: "/meetings/{args.id}", method: "PUT") {
      ...MeetingSpaceObject
    }
  }
  ${meetingSpace}
`;
