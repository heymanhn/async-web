import gql from 'graphql-tag';

export default gql`
  mutation AddDraftToConversation($conversationId: String!, $draft: Object!) {
    addDraftToConversation(conversationId: $conversationId, draft: $draft) @client
  }
`;
