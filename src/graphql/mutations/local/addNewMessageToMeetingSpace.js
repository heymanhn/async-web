import gql from 'graphql-tag';

export default gql`
  mutation AddNewMessageToMeetingSpace($meetingId: String!, $message: Object!) {
    addNewMessageToMeetingSpace(meetingId: $meetingId, message: $message) @client
  }
`;
