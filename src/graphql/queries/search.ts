import gql from 'graphql-tag';

import document from 'graphql/fragments/document';
import discussion from 'graphql/fragments/discussion';

export default gql`
  query Search($queryString: String!) {
    search(queryString: $queryString)
      @rest(
        type: "SearchResultResponse"
        path: "/search?q={args.queryString}"
        method: "GET"
      ) {
      items @type(name: "[SearchResultItem]") {
        document @type(name: "Document") {
          ...DocumentObject
        }
        discussion @type(name: "Discussion") {
          ...DiscussionObject
        }
        searchScore
      }
    }
  }
  ${document}
  ${discussion}
`;
