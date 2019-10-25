import gql from 'graphql-tag';

export default gql`
  mutation DeleteDraftFromConversation($conversationId: String!) {
    DeleteDraftFromConversation(conversationId: $conversationId) @client
  }
`;
