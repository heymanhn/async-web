import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import messageContext from 'graphql/fragments/messageContext';

export default gql`
  fragment ConversationItems on ConversationsResponse {
    items @type(name: "[ConversationItem]") {
      conversation @type(name: "Conversation") {
        ...ConversationObject
        ...MessageContext
      }
    }
    pageToken
    totalHits
  }
  ${conversation}
  ${messageContext}
`;
