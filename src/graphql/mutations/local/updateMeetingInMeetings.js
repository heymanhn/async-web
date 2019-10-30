import gql from 'graphql-tag';

export default gql`
  mutation UpdateMeetingInMeetings($meeting: Object!) {
    updateMeetingInMeetings(meeting: $meeting) @client
  }
`;
