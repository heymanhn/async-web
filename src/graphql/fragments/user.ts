import gql from 'graphql-tag';

export default gql`
  fragment UserObject on User {
    id
    fullName
    email
    profilePictureUrl
  }
`;
