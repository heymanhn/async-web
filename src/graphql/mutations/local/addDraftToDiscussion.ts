import gql from 'graphql-tag';

export default gql`
  mutation AddDraftToDiscussion($discussionId: String!, $draft: Object!) {
    addDraftToDiscussion(discussionId: $discussionId, draft: $draft) @client
  }
`;
