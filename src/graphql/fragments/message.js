import gql from 'graphql-tag';

import author from './author';
import body from './body';

export default gql`
  fragment MessageObject on Message {
    id
    author @type(name: "Author") {
      ...AuthorObject
    }
    body @type(name: "Body") {
      ...BodyObject
    }
    createdAt
    updatedAt
    conversationId
  }
  ${author}
  ${body}
`;
