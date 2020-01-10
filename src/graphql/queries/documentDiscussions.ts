import gql from 'graphql-tag';

import discussionItems from 'graphql/fragments/discussionItems';

export default gql`
  query DocumentDiscussions($id: String!, $queryParams: Object!) {
    documentDiscussions(id: $id, queryParams: $queryParams) @rest(type: "DiscussionsResponse", path: "/documents/{args.id}/discussions?{args.queryParams}", method: "GET") {
      ...DiscussionItems
    }
  }
  ${discussionItems}
`;
