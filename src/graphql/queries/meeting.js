import gql from 'graphql-tag';

import conversationWithMessageContext from 'graphql/fragments/conversationWithMessageContext';
import meetingSpace from 'graphql/fragments/meetingSpace';

export default gql`
  query Meeting($id: String!) {
    meeting(id: $id) @rest(type: "Meeting", path: "/meetings/{args.id}") {
      ...MeetingSpaceObject
      participants @type(name: "[Participant]") {
        user @type(name: "User") {
          id
          meetingId
          fullName
          profilePictureUrl
        }
      }
      conversations @type(name: "[Conversation]") {
        ...ConversationWithMessageContext
      }
    }
  }
  ${conversationWithMessageContext}
  ${meetingSpace}
`;
