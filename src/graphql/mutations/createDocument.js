import gql from 'graphql-tag';

export default gql`
  mutation CreateDocument($input: Object!) {
    createDocument(input: $input) @rest(type: "Document", path: "/documents", method: "POST") {
      id
    }
  }
`;
