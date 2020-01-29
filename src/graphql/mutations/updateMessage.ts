import gql from 'graphql-tag';

import message from 'graphql/fragments/message';

export default gql`
  mutation UpdateMessage($discussionId: String!, $messageId: String!, $input: Object!) {
    updateMessage(discussionId: $discussionId, messageId: $messageId, input: $input) @rest(type: "Message", path: "/discussions/{args.discussionId}/messages/{args.messageId}", method: "PUT") {
      ...MessageObject
    }
  }
  ${message}
`;
