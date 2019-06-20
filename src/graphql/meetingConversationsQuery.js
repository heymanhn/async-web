import gql from 'graphql-tag';

export default gql`
  mutation MeetingConversations($meetingId: String!, $input: Object!) {
    conversations(id: $id) @rest(type: "[Conversation]", path: "/meetings/{args.id}/conversations", method: "GET") {
      id
      title
      author
      createdAt
      messages @type(name: "[Message]") {
        id
        author
        createdAt
        body @type(name: "Body") {
          formatter
          payload
        }
      }
    }
  }
`;
