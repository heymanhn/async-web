import gql from 'graphql-tag';

export default gql`
  query Meetings($queryParams: Object!) {
    meetings(queryParams: $queryParams) @rest(type: "Meetings", path: "/meetings?{args.queryParams}") {
      items @type(name: "[MeetingItem]") {
        meeting @type(name: "Meeting") {
          id
          title
          author @type(name: "User") {
            id
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
        userUnreadThreadCount
      }
      pageToken
    }
  }
`;
