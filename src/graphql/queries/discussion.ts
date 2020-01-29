import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import messageContext from 'graphql/fragments/messageContext';
import messageItems from 'graphql/fragments/messageItems';

export default gql`
  query Discussion($id: String!, $queryParams: Object!) {
    discussion(id: $id) @rest(type: "Discussion", path: "/discussions/{args.id}", method: "GET") {
      ...DiscussionObject
      ...MessageContext
    }
    messages(id: $id, queryParams: $queryParams) @rest(type: "MessagesResponse", path: "/discussions/{args.id}/messages?{args.queryParams}", method: "GET") {
      ...MessageItems
    }
  }
  ${discussion}
  ${messageContext}
  ${messageItems}
`;
