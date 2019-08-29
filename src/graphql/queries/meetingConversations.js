import gql from 'graphql-tag';

import conversationWithMessageContext from 'graphql/fragments/conversationWithMessageContext';

export default gql`
  query MeetingConversations($id: String!, $queryParams: Object!) {
    meetingConversations(id: $id, queryParams: $queryParams) @rest(type: "Conversations", path: "/meetings/{args.id}/conversations?{args.queryParams}", method: "GET") {
      items @type(name: "[ConversationItem]") {
        conversation @type(name: "Conversation") {
          ...ConversationWithMessageContext
        }
      }
      pageToken
    }
  }
  ${conversationWithMessageContext}
`;
