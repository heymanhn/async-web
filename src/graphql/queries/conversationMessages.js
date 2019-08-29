import gql from 'graphql-tag';

import conversationMessage from 'graphql/fragments/conversationMessage';

export default gql`
  query ConversationMessages($id: String!, $queryParams: Object!) {
    conversationMessages(id: $id, queryParams: $queryParams) @rest(type: "Messages", path: "/conversations/{args.id}/messages?{args.queryParams}", method: "GET") {
      items @type(name: "[Item]") {
        message @type(name: "Message") {
          ...ConversationMessage
        }
      }
      messageCount
      pageToken
    }
  }
  ${conversationMessage}
`;
