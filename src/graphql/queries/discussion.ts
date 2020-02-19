import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import messageContext from 'graphql/fragments/messageContext';
import messageItems from 'graphql/fragments/messageItems';

export default gql`
  query Discussion($discussionId: String!, $queryParams: Object!) {
    discussion(discussionId: $discussionId)
      @rest(
        type: "Discussion"
        path: "/discussions/{args.discussionId}"
        method: "GET"
      ) {
      ...DiscussionObject
      ...MessageContext
      tags
    }
    messages(discussionId: $discussionId, queryParams: $queryParams)
      @rest(
        type: "MessagesResponse"
        path: "/discussions/{args.discussionId}/messages?{args.queryParams}"
        method: "GET"
      ) {
      ...MessageItems
    }
  }
  ${discussion}
  ${messageContext}
  ${messageItems}
`;
