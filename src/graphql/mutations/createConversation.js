import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import message from 'graphql/fragments/message';

export default gql`
  mutation CreateConversation($meetingId: String!, $input: Object!) {
    createConversation(meetingId: $meetingId, input: $input) @rest(type: "Conversation", path: "/meetings/{args.meetingId}/conversations", method: "POST") {
      ...ConversationObject
      messages @type(name: "Message") {
        ...MessageObject
      }
    }
  }
  ${conversation}
  ${message}
`;
