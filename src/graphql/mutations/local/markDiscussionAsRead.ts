import gql from 'graphql-tag';

export default gql`
  mutation MarkDiscussionAsRead($discussionId: String!) {
    MarkDiscussionAsRead(discussionId: $discussionId) @client
  }
`;