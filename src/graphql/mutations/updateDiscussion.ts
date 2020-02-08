import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';

export default gql`
  mutation UpdateDiscussion($discussionId: String!, $input: Object!) {
    updateDiscussion(discussionId: $discussionId, input: $input) @rest(type: "Discussion", path: "/discussions/{args.discussionId}", method: "PUT") {
      ...DiscussionObject
    }
  }
  ${discussion}
`;
