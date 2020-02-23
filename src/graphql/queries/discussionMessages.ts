import gql from 'graphql-tag';

import messageItems from 'graphql/fragments/messageItems';

export default gql`
  query DiscussionMessages($discussionId: String!, $queryParams: Object!) {
    messages(discussionId: $discussionId, queryParams: $queryParams)
      @rest(
        type: "MessagesResponse"
        path: "/discussions/{args.discussionId}/messages?{args.queryParams}"
        method: "GET"
      ) {
      ...MessageItems
    }
  }
  ${messageItems}
`;
