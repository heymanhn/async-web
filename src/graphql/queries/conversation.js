import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';

export default gql`
  query Conversation($id: String!) {
    conversation(id: $id) @rest(type: "Conversation", path: "/conversations/{args.id}", method: "GET") {
      ...ConversationObject
      unreadCounts @type(name: "[UnreadCount]") {
        userId
        count
      }
    }
    # messages(id: $id) @rest(type: "Messages", path: "/conversations/{args.id}/messages", method: "GET") {

    # }
  }
  ${conversation}
`;
