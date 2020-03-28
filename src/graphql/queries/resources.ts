import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import document from 'graphql/fragments/document';

export default gql`
  query Resources($userId: String!, $queryParams: Object!) {
    resources(userId: $userId, queryParams: $queryParams)
      @rest(
        type: "Resources"
        path: "/users/{args.userId}/resources?{args.queryParams}"
      ) {
      items @type(name: "ResourceItem") {
        discussion @type(name: "Discussion") {
          ...DiscussionObject
        }
        document @type(name: "Document") {
          ...DocumentObject
        }
        accessType
        badgeCount
      }
      totalHits
      pageToken
    }
  }
  ${discussion}
  ${document}
`;
