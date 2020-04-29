import gql from 'graphql-tag';

import messageDraft from 'graphql/fragments/messageDraft';

export default gql`
  mutation CreateMessageDraft($discussionId: String!, $input: Object!) {
    createMessageDraft(discussionId: $discussionId, input: $input)
      @rest(
        type: "MessageDraft"
        path: "/discussions/{args.discussionId}/drafts"
        method: "POST"
      ) {
      ...MessageDraftObject
    }
  }
  ${messageDraft}
`;
