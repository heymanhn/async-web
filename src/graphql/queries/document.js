import gql from 'graphql-tag';

import doc from 'graphql/fragments/document';

export default gql`
  query Document($id: String!) {
    document(id: $id) @rest(type: "Document", path: "/documents/{args.id}", method: "GET") {
      ...DocumentObject
    }
  }
  ${doc}
`;
