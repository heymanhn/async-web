import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import replyContext from 'graphql/fragments/replyContext';

export default gql`
  fragment DiscussionItems on DiscussionsResponse {
    items @type(name: "[DiscussionItem]") {
      discussion @type(name: "Discussion") {
        ...DiscussionObject
        ...ReplyContext
      }
    }
    pageToken
    totalHits
  }
  ${discussion}
  ${replyContext}
`;
