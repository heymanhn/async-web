import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import document from 'graphql/fragments/document';

export default gql`
  query Inbox($id: String!) {
    inbox(id: $id) @rest(type: "Inbox", path: "/users/{args.id}/inbox", method: "GET") {
      items @type(name: "InboxItem]") {
        discussion @type(name: "Discussion") {
          ...DiscussionObject
        }
        document @type(name: "Document") {
          ...DocumentObject
        }
      }
      pageToken
      totalHits
    }
  }
  ${document}
  ${discussion}
`;