import gql from 'graphql-tag';

import message from 'graphql/fragments/message';
import meeting from 'graphql/fragments/meeting';

export default gql`
  query Meetings($queryParams: Object!) {
    meetings(queryParams: $queryParams) @rest(type: "Meetings", path: "/meetings?{args.queryParams}") {
      items @type(name: "[MeetingItem]") {
        meeting @type(name: "Meeting") {
          ...MeetingObject
          lastMessage @type(name: "Message") {
            ...MessageObject
          }
        }
        conversationCount
        unreadConversationIds
      }
      pageToken
    }
  }
  ${message}
  ${meeting}
`;
