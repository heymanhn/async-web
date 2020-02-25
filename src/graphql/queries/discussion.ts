import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import messageContext from 'graphql/fragments/messageContext';

export default gql`
  query Discussion($discussionId: String!) {
    discussion(discussionId: $discussionId)
      @rest(
        type: "Discussion"
        path: "/discussions/{args.discussionId}"
        method: "GET"
      ) {
      ...DiscussionObject
      ...MessageContext
      tags
      messageCount
    }
  }
  ${discussion}
  ${messageContext}
`;
