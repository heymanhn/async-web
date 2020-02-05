import gql from 'graphql-tag';

export default gql`
  mutation AddDocumentMember($id: String!, $input: Object!) {
    addDocumentMember(id: $id, input: $input) @rest(type: "Success", path: "/documents/{args.id}/access", method: "POST") {
      success
    }
  }
`;
