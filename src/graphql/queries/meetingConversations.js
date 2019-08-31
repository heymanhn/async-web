import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import conversationMessage from 'graphql/fragments/conversationMessage';
import messageContext from 'graphql/fragments/messageContext';

export default gql`
  query MeetingConversations($id: String!, $queryParams: Object!) {
    meetingConversations(id: $id, queryParams: $queryParams) @rest(type: "Conversations", path: "/meetings/{args.id}/conversations?{args.queryParams}", method: "GET") {
      items @type(name: "[ConversationItem]") {
        conversation @type(name: "Conversation") {
          ...ConversationObject
          ...MessageContext
        }
      }
      pageToken
    }
  }
  ${conversation}
  ${conversationMessage}
  ${messageContext}
`;
