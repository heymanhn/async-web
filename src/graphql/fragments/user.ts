import gql from 'graphql-tag';

export default gql`
  fragment UserObject on User {
    id
    firstName
    fullName
    email
    profilePictureUrl
  }
`;
