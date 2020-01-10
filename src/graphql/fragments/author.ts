import gql from 'graphql-tag';

export default gql`
  fragment AuthorObject on Author {
    id
    fullName
    profilePictureUrl
  }
`;
