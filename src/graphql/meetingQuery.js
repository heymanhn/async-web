import gql from 'graphql-tag';

export default gql`
  query Meeting($id: String!) {
    meeting(id: $id) @rest(type: "Meeting", path: "/meetings/{args.id}") {
      id
      title
      body @type(name: "Body") {
        formatter
        payload
      }
      participants @type(name: "[Participant]") {
        user @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
        accessType
      }
      conversations @type(name: "[Conversation]") {
        id
        createdAt
      }
    }
  }
`;
