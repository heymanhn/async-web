import gql from 'graphql-tag';

export default gql`
  query FakeMembers($id: String!) {
    fakeMembers @rest(type: "[User]", path: "/organizations/1/members", method: "GET") {
      id
      fullName
      profilePictureUrl
    }
  }
`;
