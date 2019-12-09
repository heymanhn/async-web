import gql from 'graphql-tag';

import body from 'graphql/fragments/body';

export default gql`
  mutation CreateReplyDraft($discussionId: String!, $input: Object!) {
    createReplyDraft(discussionId: $discussionId, input: $input) @rest(type: "ReplyDraft", path: "/discussions/{args.discussionId}/drafts", method: "POST") {
      body @type(name: "Body") {
        ...BodyObject
      }
    }
  }
  ${body}
`;
