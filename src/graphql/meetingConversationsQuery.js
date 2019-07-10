import gql from 'graphql-tag';

export default gql`
  query MeetingConversations($id: String!) {
    conversationsQuery(id: $id) @rest(type: "Conversations", path: "/meetings/{args.id}/conversations?exclude_child_level=true", method: "GET") {
      conversations @type(name: "[Conversation]") {
        id
        createdAt
      }
    }
  }
`;
