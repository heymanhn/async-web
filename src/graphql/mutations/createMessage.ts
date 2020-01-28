import gql from 'graphql-tag';

import message from 'graphql/fragments/message';

export default gql`
  mutation CreateMessage($discussionId: String!, $input: Object!) {
    createMessage(discussionId: $discussionId, input: $input) @rest(type: "Message", path: "/discussions/{args.discussionId}/messages", method: "POST") {
      ...MessageObject
    }
  }
  ${message}
`;
