import gql from 'graphql-tag';

import user from 'graphql/fragments/user';

export default gql`
  query OrganizationMembers($id: String!) {
    organizationMembers(id: $id) @rest(type: "OrganizationMembers", path: "/organizations/{args.id}/members", method: "GET") {
      members @type(name: "[Member]") {
        user @type(name: "User") {
          ...UserObject
        }
      }
    }
  }
  ${user}
`;
