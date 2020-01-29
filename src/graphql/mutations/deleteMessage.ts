import gql from 'graphql-tag';

export default gql`
  mutation DeleteMessage($discussionId: String!, $messageId: String!) {
    deleteMessage(discussionId: $discussionId, messageId: $messageId) @rest(type: "DeleteMessageResponse", path: "/discussions/{args.discussionId}/messages/{args.messageId}", method: "DELETE") {
      success
    }
  }
`;
