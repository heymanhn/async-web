import gql from 'graphql-tag';

export default gql`
  query OrganizationMembers($id: String!) {
    organizationMembers(id: $id) @rest(type: "[User]", path: "/organizations/{args.Id}/members", method: "GET") {
      id
      fullName
      profilePictureUrl
    }
  }
`;
