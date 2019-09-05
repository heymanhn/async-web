import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import messageItems from 'graphql/fragments/messageItems';

export default gql`
  query Conversation($id: String!, $queryParams: Object!) {
    conversation(id: $id) @rest(type: "Conversation", path: "/conversations/{args.id}", method: "GET") {
      ...ConversationObject
    }
    messages(id: $id, queryParams: $queryParams) @rest(type: "MessagesResponse", path: "/conversations/{args.id}/messages?{args.queryParams}", method: "GET") {
      ...MessageItems
    }
  }
  ${conversation}
  ${messageItems}
`;
