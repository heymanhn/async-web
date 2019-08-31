import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';
import meeting from 'graphql/fragments/meeting';

export default gql`
  query Meetings($queryParams: Object!) {
    meetings(queryParams: $queryParams) @rest(type: "Meetings", path: "/meetings?{args.queryParams}") {
      items @type(name: "[MeetingItem]") {
        meeting @type(name: "Meeting") {
          ...MeetingObject
          lastMessage @type(name: "Message") {
            ...ConversationMessageObject
          }
        }
        conversationCount
        userUnreadThreadCount
      }
      pageToken
    }
  }
  ${conversationMessage}
  ${meeting}
`;
