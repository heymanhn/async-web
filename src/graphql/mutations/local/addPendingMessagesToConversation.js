import gql from 'graphql-tag';

export default gql`
  mutation AddPendingMessagesToConversation($conversationId: String!) {
    addPendingMessagesToConversation(conversationId: $conversationId) @client
  }
`;
