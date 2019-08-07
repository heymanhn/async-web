import gql from 'graphql-tag';

export default gql`
  query DiscussionFeed($id: String!) {
    discussionFeed(id: $id) @rest(type: "User", path: "/users/{args.id}/feed") {
      items @type(name: "[DiscussionFeedItem]") {
        meeting @type(name: "Meeting") {
          id
          title
        }
        conversation @type(name: "Conversation") {
          id
          title
        }
      }
    }
  }
`;
