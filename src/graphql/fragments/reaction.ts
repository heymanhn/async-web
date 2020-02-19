import gql from 'graphql-tag';

import user from 'graphql/fragments/user';

export default gql`
  fragment ReactionObject on Reaction {
    id
    code
    objectType
    objectId
    author @type(name: "User") {
      id
    }
    createdAt
    updatedAt
  }
  ${user}
`;
