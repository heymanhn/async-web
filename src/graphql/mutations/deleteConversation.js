import gql from 'graphql-tag';

export default gql`
  mutation DeleteConversation($meetingId: String!, $conversationId: String!) {
    deleteConversation(meetingId: $meetingId, conversationId: $conversationId) @rest(type: "DeleteConversationResponse", path: "/meetings/{args.meetingId}/conversations/{args.conversationId}", method: "DELETE") {
      success
    }
  }
`;
