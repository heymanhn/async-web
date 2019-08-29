import gql from 'graphql-tag';

import conversationMessageItems from 'graphql/fragments/conversationMessageItems';

export default gql`
  query ConversationMessages($id: String!, $queryParams: Object!) {
    conversationMessages(id: $id, queryParams: $queryParams) @rest(type: "MessagesResponse", path: "/conversations/{args.id}/messages?{args.queryParams}", method: "GET") {
      ...ConversationMessageItems
    }
  }
  ${conversationMessageItems}
`;
