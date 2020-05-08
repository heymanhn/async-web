import gql from 'graphql-tag';

import threadItems from 'graphql/fragments/threadItems';

export default gql`
  query DocumentThreads($id: String!, $queryParams: Object!) {
    documentThreads(id: $id, queryParams: $queryParams) @rest(type: "ThreadsResponse", path: "/documents/{args.id}/threads?{args.queryParams}", method: "GET") {
      ...ThreadItems
    }
  }
  ${threadItems}
`;
