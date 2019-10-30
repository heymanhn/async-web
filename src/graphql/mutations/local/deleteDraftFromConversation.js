import gql from 'graphql-tag';

export default gql`
  mutation DeleteDraftFromConversation($conversationId: String!) {
    deleteDraftFromConversation(conversationId: $conversationId) @client
  }
`;
