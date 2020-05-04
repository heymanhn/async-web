import gql from 'graphql-tag';

import discussionItems from 'graphql/fragments/discussionItems';

export default gql`
  query DocumentThreads($id: String!, $queryParams: Object!) {
    documentThreads(id: $id, queryParams: $queryParams) @rest(type: "ThreadsResponse", path: "/documents/{args.id}/threads?{args.queryParams}", method: "GET") {
      ...DiscussionItems
    }
  }
  ${discussionItems}
`;
