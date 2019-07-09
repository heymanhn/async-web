import gql from 'graphql-tag';

export default gql`
  query Meetings($id: String!) {
    meetings @rest(type: "Meetings", path: "/meetings") {
      items @type(name: "[Item]") {
        meeting @type(name: "Meeting") {
          id
          title
          author @type(name: "User") {
            id
          }
          participants @type(name: "[Participant]") {
            user @type(name: "User") {
              id
              fullName
              profilePictureUrl
            }
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
