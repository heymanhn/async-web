import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import conversationMessageItems from 'graphql/fragments/conversationMessageItems';

export default gql`
  query Conversation($id: String!, $queryParams: Object!) {
    conversation(id: $id) @rest(type: "Conversation", path: "/conversations/{args.id}", method: "GET") {
      ...ConversationObject
      unreadCounts @type(name: "[UnreadCount]") {
        userId
        count
      }
    }
    messages(id: $id, queryParams: $queryParams) @rest(type: "MessagesResponse", path: "/conversations/{args.id}/messages?{args.queryParams}", method: "GET") {
      ...ConversationMessageItems
    }
  }
  ${conversation}
  ${conversationMessageItems}
`;
