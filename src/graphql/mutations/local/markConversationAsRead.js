import gql from 'graphql-tag';

export default gql`
  mutation MarkConversationAsRead($conversationId: String!, $meetingId: String!) {
    MarkConversationAsRead(conversationId: $conversationId, meetingId: $meetingId) @client
  }
`;
