import gql from 'graphql-tag';
import user from 'graphql/fragments/user';

export default gql`
  query DiscussionMembers($id: String!) {
    discussionMembers(id: $id) @rest(type: "DiscussionMembers", path: "/discussions/{args.id}/members", method: "GET") {
      members @type(name: "[Member]") {
        user @type(name: "User") {
          ...UserObject
        }
        accessType
      }
    }
  }
  ${user}
`;
