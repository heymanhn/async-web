import gql from 'graphql-tag';

import document from 'graphql/fragments/document';
import discussion from 'graphql/fragments/discussion';
import workspace from 'graphql/fragments/workspace';

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
          tags
          discussionCount
        }
        discussion @type(name: "Discussion") {
          ...DiscussionObject
          tags
          messageCount
        }
        workspace @type(name: "Workspace") {
          ...WorkspaceObject
        }
        searchScore
      }
    }
  }
  ${document}
  ${discussion}
  ${workspace}
`;
