import gql from 'graphql-tag';

import meeting from 'graphql/fragments/meeting';
import reaction from 'graphql/fragments/reaction';
import conversationItems from 'graphql/fragments/conversationItems';

export default gql`
  query Meeting($id: String!, $queryParams: Object!) {
    meeting(id: $id) @rest(type: "Meeting", path: "/meetings/{args.id}") {
      ...MeetingObject
      reactions @type(name: "Reaction") {
        ...ReactionObject
      }
      participants @type(name: "[Participant]") {
        user @type(name: "User") {
          id
          meetingId
          fullName
          profilePictureUrl
        }
      }
    }
    conversations(id: $id, queryParams: $queryParams) @rest(type: "ConversationsResponse", path: "/meetings/{args.id}/conversations?{args.queryParams}", method: "GET") {
      ...ConversationItems
    }
  }
  ${meeting}
  ${reaction}
  ${conversationItems}
`;
