import gql from 'graphql-tag';

import author from './author';
import body from './body';

export default gql`
  fragment ReplyObject on Reply {
    id
    author @type(name: "Author") {
      ...AuthorObject
    }
    body @type(name: "Body") {
      ...BodyObject
    }
    createdAt
    updatedAt
    discussionId
  }
  ${author}
  ${body}
`;
