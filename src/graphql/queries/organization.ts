import gql from 'graphql-tag';

export default gql`
  query Organization($id: String!) {
    organization(id: $id) @rest(type: "Organization", path: "/organizations/{args.id}", method: "GET") {
      id
      title
      logo
      defaultDocumentId
    }
  }
`;
