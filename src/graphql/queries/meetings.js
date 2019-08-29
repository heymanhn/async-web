import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';
import meetingSpace from 'graphql/fragments/meetingSpace';

export default gql`
  query Meetings($queryParams: Object!) {
    meetings(queryParams: $queryParams) @rest(type: "Meetings", path: "/meetings?{args.queryParams}") {
      items @type(name: "[MeetingItem]") {
        meeting @type(name: "Meeting") {
          ...MeetingSpaceObject
          lastMessage @type(name: "Message") {
            ...ConversationMessage
          }
        }
        conversationCount
        userUnreadThreadCount
      }
      pageToken
    }
  }
  ${conversationMessage}
  ${meetingSpace}
`;
