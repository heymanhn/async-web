import gql from 'graphql-tag';

import discussion from 'graphql/fragments/discussion';
import message from 'graphql/fragments/message';

export default gql`
  mutation CreateDiscussion($input: Object!) {
    createDiscussion(input: $input) @rest(type: "Discussion", path: "/discussions", method: "POST") {
      ...DiscussionObject
      messages @type(name: "Message") {
        ...MessageObject
      }
    }
  }
  ${discussion}
  ${message}
`;
