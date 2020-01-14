import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import replyContext from 'graphql/fragments/replyContext';
import replyItems from 'graphql/fragments/replyItems';

export default gql`
  query Discussion($id: String!, $queryParams: Object!) {
    discussion(id: $id) @rest(type: "Discussion", path: "/discussions/{args.id}", method: "GET") {
      ...DiscussionObject
      ...ReplyContext
    }
    replies(id: $id, queryParams: $queryParams) @rest(type: "RepliesResponse", path: "/discussions/{args.id}/replies?{args.queryParams}", method: "GET") {
      ...ReplyItems
    }
  }
  ${discussion}
  ${replyContext}
  ${replyItems}
`;