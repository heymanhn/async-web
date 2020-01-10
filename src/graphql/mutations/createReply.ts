import gql from 'graphql-tag';

import reply from 'graphql/fragments/reply';

export default gql`
  mutation CreateReply($discussionId: String!, $input: Object!) {
    createReply(discussionId: $discussionId, input: $input) @rest(type: "Reply", path: "/discussions/{args.discussionId}/replies", method: "POST") {
      ...ReplyObject
    }
  }
  ${reply}
`;
