import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import message from 'graphql/fragments/message';

export default gql`
  mutation CreateDocumentDiscussion($documentId: String!, $input: Object!) {
    createDocumentDiscussion(documentId: $documentId, input: $input) @rest(type: "Discussion", path: "/documents/{args.documentId}/discussions", method: "POST") {
      ...DiscussionObject
      messages @type(name: "Message") {
        ...MessageObject
      }
    }
  }
  ${discussion}
  ${message}
`;
