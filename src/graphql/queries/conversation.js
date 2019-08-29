import gql from 'graphql-tag';

export default gql`
  query Conversation($id: String!) {
    conversation(id: $id) @rest(type: "Conversation", path: "/conversations/{args.id}", method: "GET") {
      id
      author @type(name: "Author") {
        id
        fullName
        profilePictureUrl
      }
      createdAt
      updatedAt
      meetingId
      unreadCounts @type(name: "[UnreadCount]") {
        userId
        count
      }
    }
    # messages(id: $id) @rest(type: "Messages", path: "/conversations/{args.id}/messages", method: "GET") {

    # }
  }
`;
