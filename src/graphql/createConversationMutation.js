import gql from 'graphql-tag';

export default gql`
  mutation CreateConversation($meetingId: String!, $input: Object!) {
    createConversation(meetingId: $meetingId, input: $input) @rest(type: "Conversation", path: "/meetings/{args.meetingId}/conversations", method: "POST") {
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
