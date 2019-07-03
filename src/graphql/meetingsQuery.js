import gql from 'graphql-tag';

export default gql`
  query Meetings($id: String!) {
    meetings @rest(type: "Meetings", path: "/meetings") {
      items @type(name: "[Item]") {
        meeting @type(name: "Meeting") {
          id
          title
          participants @type(name: "[Participant]") {
            id
            fullName
            profilePictureUrl
          }
          lastMessage @type(name: "Message") {
            author @type(name: "Author") {
              id
              fullName
              profilePictureUrl
            }
            createdAt
          }
          createdAt
          deadline
        }
        conversationCount
      }
    }
  }
`;