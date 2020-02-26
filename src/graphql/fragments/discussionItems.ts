import gql from 'graphql-tag';

export default gql`
  fragment DiscussionItems on DiscussionsResponse {
    items @type(name: "[DiscussionItem]") {
      discussion @type(name: "Discussion") {
        id
      }
    }
    pageToken
  }
`;
