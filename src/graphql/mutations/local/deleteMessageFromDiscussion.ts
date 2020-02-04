import gql from 'graphql-tag';

export default gql`
  mutation DeleteMessageFromDiscussion(
    $discussionId: String!
    $messageId: String!
  ) {
    deleteMessageFromDiscussion(
      discussionId: $discussionId
      messageId: $messageId
    ) @client
  }
`;
