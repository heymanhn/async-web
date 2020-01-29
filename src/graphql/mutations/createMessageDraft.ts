import gql from 'graphql-tag';

import body from 'graphql/fragments/body';

export default gql`
  mutation CreateMessageDraft($discussionId: String!, $input: Object!) {
    createMessageDraft(discussionId: $discussionId, input: $input) @rest(type: "MessageDraft", path: "/discussions/{args.discussionId}/drafts", method: "POST") {
      body @type(name: "Body") {
        ...BodyObject
      }
    }
  }
  ${body}
`;
