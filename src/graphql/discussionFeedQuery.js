import gql from 'graphql-tag';

export default gql`
  query DiscussionFeed($id: String!, $queryParams: Object!) {
    discussionFeed(id: $id, queryParams: $queryParams) @rest(type: "Feed", path: "/users/{args.id}/feed?{args.queryParams}") {
      items @type(name: "[DiscussionFeedItem]") {
        meeting @type(name: "Meeting") {
          id
          title
        }
        conversation @type(name: "Conversation") {
          id
          messageCount
          parentId
          title
        }
      }
      pageToken
    }
  }
`;
