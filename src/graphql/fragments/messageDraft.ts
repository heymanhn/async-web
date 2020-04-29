import gql from 'graphql-tag';

import body from './body';

export default gql`
  fragment MessageDraftObject on MessageDraft {
    body @type(name: "Body") {
      ...BodyObject
    }
    updatedAt
  }
  ${body}
`;
