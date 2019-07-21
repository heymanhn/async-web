import gql from 'graphql-tag';

export default gql`
  query ConversationMessage($cid: String!, $mid: String!) {
    conversationMessage(id: $id) @rest(type: "Message", path: "/conversations/{args.cid}/messages/{args.mid}", method: "GET") {
      id
      author @type(name: "Author") {
        id
        fullName
        profilePictureUrl
      }
      createdAt
      updatedAt
      body @type(name: "Body") {
        formatter
        payload
      }
      childConversationId
      replyCount
      reactions @type(name: "[Reaction]") {
        id
        code
        author @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
      }
    }
  }
`;
