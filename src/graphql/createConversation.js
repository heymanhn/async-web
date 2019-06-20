import gql from 'graphql-tag';

export default gql`
  mutation CreateConversation($meetingId: String!, $input: Object!) {
    createConversation(meetingId: $meetingId, input: $input) @rest(type: "Conversation", path: "/meetings/{args.meetingId}/conversations", method: "POST") {
      id
      title
      messages @type(name: "[Message]") {

      }
      body @type(name: "[Body]") {
        formatter
        payload
      }
    }
  }
`;
