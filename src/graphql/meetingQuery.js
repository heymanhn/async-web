import gql from 'graphql-tag';

export default gql`
  query Meeting($id: String!) {
    meeting(id: $id) @rest(type: "Meeting", path: "/meetings/{args.id}") {
      id
      deadline
      title
      author @type(name: "User") {
        id
        fullName
        profilePictureUrl
      }
      body @type(name: "Body") {
        formatter
        payload
      }
      participants @type(name: "[Participant]") {
        user @type(name: "User") {
          id
          meetingId
          fullName
          profilePictureUrl
        }
      }
      conversations @type(name: "[Conversation]") {
        id
        author @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
        createdAt
        meetingId
        messageCount
        title
        lastMessage @type(name: "Message") {
          id
          createdAt
          body @type(name: "Body") {
            formatter
            payload
            text
          }
          author @type(name: "User") {
            id
            fullName
            profilePictureUrl
          }
        }
      }
    }
  }
`;
