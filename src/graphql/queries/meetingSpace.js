import gql from 'graphql-tag';

import conversation from 'graphql/fragments/conversation';
import meetingSpace from 'graphql/fragments/meetingSpace';
import messageContext from 'graphql/fragments/messageContext';

export default gql`
  query MeetingSpace($id: String!) {
    meetingSpace(id: $id) @rest(type: "MeetingSpace", path: "/meetings/{args.id}") {
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
