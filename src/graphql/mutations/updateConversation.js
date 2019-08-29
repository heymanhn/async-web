import gql from 'graphql-tag';

export default gql`
  mutation UpdateConversation($meetingId: String!, $conversationId: String!, $input: Object!) {
    updateConversation(meetingId: $meetingId, conversationId: $conversationId, input: $input) @rest(type: "Conversation", path: "/meetings/{args.meetingId}/conversations/{args.conversationId}", method: "PUT") {
      id
      title
    }
  }
`;
