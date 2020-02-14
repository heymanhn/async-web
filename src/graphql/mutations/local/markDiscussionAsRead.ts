import gql from 'graphql-tag';

export default gql`
  mutation MarkDiscussionAsRead($discussionId: String!) {
    markDiscussionAsRead(discussionId: $discussionId) @client
  }
`;