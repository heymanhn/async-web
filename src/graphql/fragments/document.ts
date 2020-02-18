import gql from 'graphql-tag';

import body from './body';
import user from './user';
import reaction from './reaction';

export default gql`
  fragment DocumentObject on Document {
    id
    title
    owner @type(name: "User") {
      ...UserObject
    }
    body @type(name: "Body") {
      ...BodyObject
    }
    reactions @type(name: "Reaction") {
      ...ReactionObject
    }
    discussionCount
    tags
    createdAt
    updatedAt
  }
  ${body}
  ${user}
  ${reaction}
`;
