import gql from 'graphql-tag';

export default gql`
  mutation UpdateMeetingBadgeCount($meetingId: String!, $badgeCount: Int!) {
    updateMeetingBadgeCount(meetingId: $meetingId, badgeCount: $badgeCount) @client
  }
`;
