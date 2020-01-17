import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';

export default gql`
  mutation UpdateDiscussion($documentId: String!, $discussionId: String!, $input: Object!) {
    updateDiscussion(documentId: $documentId, discussionId: $discussionId, input: $input) @rest(type: "Discussion", path: "/documents/{args.documentId}/discussions/{args.discussionId}", method: "PUT") {
      ...DiscussionObject
    }
  }
  ${discussion}
`;
