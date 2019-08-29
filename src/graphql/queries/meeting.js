import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import meetingSpace from 'graphql/fragments/meetingSpace';
import messageContext from 'graphql/fragments/messageContext';

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
      conversations @type(name: "Conversation") {
        ...ConversationObject
        ...MessageContext
      }
    }
  }
  ${conversation}
  ${meetingSpace}
  ${messageContext}
`;
