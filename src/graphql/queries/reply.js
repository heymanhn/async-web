import gql from 'graphql-tag';

import reply from 'graphql/fragments/reply';
import reaction from 'graphql/fragments/reaction';

export default gql`
  query Reply($discussionId: String!, $replyId: String!) {
    reply(discussionId: $discussionId, replyId: $replyId) @rest(type: "Reply", path: "/discussions/{args.discussionId}/replies/{args.replyId}", method: "GET") {
      ...ReplyObject
      reactions @type(name: "Reaction") {
         ...ReactionObject
      }
    }
  }
  ${reply}
  ${reaction}
`;
