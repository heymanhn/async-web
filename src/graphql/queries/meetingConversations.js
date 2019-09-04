import gql from 'graphql-tag';

import conversationItems from 'graphql/fragments/conversationItems';

export default gql`
  query MeetingConversations($id: String!, $queryParams: Object!) {
    meetingConversations(id: $id, queryParams: $queryParams) @rest(type: "ConversationsResponse", path: "/meetings/{args.id}/conversations?{args.queryParams}", method: "GET") {
      ...ConversationItems
    }
  }
  ${conversationItems}
`;
