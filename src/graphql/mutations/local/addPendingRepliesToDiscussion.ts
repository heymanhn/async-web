import gql from 'graphql-tag';

export default gql`
  mutation AddPendingRepliesToDiscussion($discussionId: String!) {
    addPendingRepliesToDiscussion(discussionId: $discussionId) @client
  }
`;
