import gql from 'graphql-tag';

import author from './author';
import body from './body';

export default gql`
  fragment DocumentObject on Document {
    id
    title
    owner @type(name: "Author") {
      ...AuthorObject
    }
    body @type(name: "Body") {
      ...BodyObject
    }
    createdAt
    updatedAt
  }
  ${author}
  ${body}
`;
