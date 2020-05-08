import gql from 'graphql-tag';

export default gql`
  fragment ThreadItems on ThreadsResponse {
    items @type(name: "[ThreadItem]") {
      discussion @type(name: "Discussion") {
        id
      }
    }
    pageToken
  }
`;
