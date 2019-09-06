import gql from 'graphql-tag';

export default gql`
  fragment ReactionObject on Reaction {
    id
    code
    objectType
    objectId
    parentId
    author @type(name: "Author") {
      id
      fullName
      profilePictureUrl
    }
    createdAt
    updatedAt
  }
`;
