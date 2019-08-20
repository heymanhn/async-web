import gql from 'graphql-tag';

export default gql`
  query MeetingConversations($id: String!, $queryParams: Object!) {
    meetingConversations(id: $id, queryParams: $queryParams) @rest(type: "Conversations", path: "/meetings/{args.id}/conversations?{args.queryParams}", method: "GET") {
      items @type(name: "[ConversationItem]") {
        conversation @type(name: "Conversation") {
          id
          createdAt
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
      pageToken
    }
  }
`;
