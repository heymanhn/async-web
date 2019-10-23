import gql from 'graphql-tag';

import body from 'graphql/fragments/body';

export default gql`
  mutation CreateMessageDraft($conversationId: String!, $input: Object!) {
    createMessageDraft(conversationId: $conversationId, input: $input) @rest(type: "MessageDraft", path: "/conversations/{args.conversationId}/drafts", method: "POST") {
      body @type(name: "Body") {
        ...BodyObject
      }
    }
  }
  ${body}
`;
