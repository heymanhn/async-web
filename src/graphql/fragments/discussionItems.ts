import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import messageContext from 'graphql/fragments/messageContext';

export default gql`
  fragment DiscussionItems on DiscussionsResponse {
    items @type(name: "[DiscussionItem]") {
      discussion @type(name: "Discussion") {
        ...DiscussionObject
        ...MessageContext
      }
    }
    pageToken
    totalHits
  }
  ${discussion}
  ${messageContext}
`;
