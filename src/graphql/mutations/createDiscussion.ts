import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import reply from 'graphql/fragments/reply';

export default gql`
  mutation CreateDiscussion($documentId: String!, $input: Object!) {
    createDiscussion(documentId: $documentId, input: $input) @rest(type: "Discussion", path: "/documents/{args.documentId}/discussions", method: "POST") {
      ...DiscussionObject
      replies @type(name: "Reply") {
        ...ReplyObject
      }
    }
  }
  ${discussion}
  ${reply}
`;
