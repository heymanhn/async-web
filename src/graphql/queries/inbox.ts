import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import document from 'graphql/fragments/document';

export default gql`
  query Inbox($id: String!, $queryParams: Object!) {
    inbox(id: $id, queryParams: $queryParams)
      @rest(
        type: "Inbox"
        path: "/users/{args.id}/inbox?{args.queryParams}"
        method: "GET"
      ) {
      items @type(name: "InboxItem]") {
        discussion @type(name: "Discussion") {
          ...DiscussionObject
          tags
          messageCount
        }
        document @type(name: "Document") {
          ...DocumentObject
          tags
          discussionCount
        }
      }
      pageToken
    }
  }
  ${document}
  ${discussion}
`;
