import gql from 'graphql-tag';

export default gql`
  mutation UpdateMessageInDiscussion(
    $discussionId: String!
    $messageId: String!
  ) {
    updateMessageInDiscussion(
      discussionId: $discussionId
      messageId: $messageId
    ) @client
  }
`;
