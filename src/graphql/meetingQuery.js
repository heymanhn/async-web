import gql from 'graphql-tag';

export default gql`
  query Meeting($id: String!) {
    meeting(id: $id) @rest(type: "Meeting", path: "/meetings/{args.id}") {
      id
      deadline
      title
      author @type(name: "User") {
        id
      }
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
      }
      conversations @type(name: "[Conversation]") {
        id
        createdAt
      }
    }
  }
`;
