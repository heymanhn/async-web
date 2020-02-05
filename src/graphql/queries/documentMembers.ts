import gql from 'graphql-tag';
import user from 'graphql/fragments/user';

export default gql`
  query DocumentMembers($id: String!) {
    documentMembers(id: $id) @rest(type: "DocumentMembers", path: "/documents/{args.id}/members", method: "GET") {
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
