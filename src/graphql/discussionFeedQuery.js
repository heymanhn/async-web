import gql from 'graphql-tag';

export default gql`
  query DiscussionFeed($id: String!, $meetingId: String!) {
    discussionFeed(id: $id, meetingId: $meetingId) @rest(type: "User", path: "/users/{args.id}/feed?meeting_id={args.meetingId}") {
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
    }
  }
`;
