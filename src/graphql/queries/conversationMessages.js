import gql from 'graphql-tag';

import messageItems from 'graphql/fragments/messageItems';

export default gql`
  query ConversationMessages($id: String!, $queryParams: Object!) {
    conversationMessages(id: $id, queryParams: $queryParams) @rest(type: "MessagesResponse", path: "/conversations/{args.id}/messages?{args.queryParams}", method: "GET") {
      ...MessageItems
    }
  }
  ${messageItems}
`;
