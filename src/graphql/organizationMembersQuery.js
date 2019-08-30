import gql from 'graphql-tag';

export default gql`
  query OrganizationMembers($id: String!) {
    organizationMembers(id: $id) @rest(type: "[User]", path: "/organizations/{args.id}/members", method: "GET") {
      members @type(name: "[User]") {
        user @type(name: "User") {
          id
          fullName
          profilePictureUrl
        }
      }
    }
  }
`;
