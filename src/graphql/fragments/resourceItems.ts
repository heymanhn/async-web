import gql from 'graphql-tag';

import discussion from './discussion';
import document from './document';

export default gql`
  fragment ResourceItems on ResourcesResponse {
    items @type(name: "ResourceItem") {
      discussion @type(name: "Discussion") {
        ...DiscussionObject
        messageCount
      }
      document @type(name: "Document") {
        ...DocumentObject
        discussionCount
      }
    }
    totalHits
    pageToken
  }
  ${discussion}
  ${document}
`;
