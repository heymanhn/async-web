import gql from 'graphql-tag';

export default gql`
  mutation AddNewMeetingToMeetings($meeting: Object!) {
    addNewMeetingToMeetings(meeting: $meeting) @client
  }
`;
