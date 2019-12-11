import gql from 'graphql-tag';

export default gql`
  mutation DeleteDraftFromDiscussion($discussionId: String!) {
    deleteDraftFromDiscussion(discussionId: $discussionId) @client
  }
`;
