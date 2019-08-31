import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import meeting from 'graphql/fragments/meeting';
import messageContext from 'graphql/fragments/messageContext';

export default gql`
  query Meeting($id: String!) {
    meeting(id: $id) @rest(type: "Meeting", path: "/meetings/{args.id}") {
      ...MeetingObject
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
  ${meeting}
  ${messageContext}
`;
