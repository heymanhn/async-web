import gql from 'graphql-tag';

export default gql`
  mutation DeleteMessageDraft($conversationId: String!) {
    deleteMessageDraft(conversationId: $conversationId, input: $input) @rest(type: "MessageDraft", path: "/conversations/{args.conversationId}/drafts", method: "DELETE") {
      success
    }
  }
`;
