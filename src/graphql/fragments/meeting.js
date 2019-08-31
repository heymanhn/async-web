import gql from 'graphql-tag';

export default gql`
  fragment MeetingObject on Meeting {
    id
    title
    author @type(name: "User") {
      id
      fullName
      profilePictureUrl
    }
    body @type(name: "Body") {
      formatter
      payload
      text
    }
  }
`;
