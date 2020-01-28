import gql from 'graphql-tag';

export default gql`
  mutation AddPendingMessagesToDiscussion($discussionId: String!) {
    addPendingMessagesToDiscussion(discussionId: $discussionId) @client
  }
`;
