import gql from 'graphql-tag';

import discussion from './discussion';
import document from './document';
import notification from './notification';

export default gql`
  fragment ResourceItems on ResourcesResponse {
    items @type(name: "ResourceItem") {
      discussion @type(name: "WorkspaceDiscussion") {
        id
        title
        updatedAt
      }
      document @type(name: "WorkspaceDocument") {
        id
        title
        updatedAt
      }
      lastUpdate @type(name: "Notification") {
        ...NotificationObject
      }
    }
    totalHits
    pageToken
  }
  ${discussion}
  ${document}
  ${notification}
`;
