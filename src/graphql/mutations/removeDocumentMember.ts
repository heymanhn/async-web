import gql from 'graphql-tag';

export default gql`
  mutation RemoveDocumentMember($id: String!, $userId: String!) {
    removeMember(id: $id, userId: $userId) @rest(type: "Success", path: "/documents/{args.id}/access?user_id={args.userId}", method: "DELETE") {
      success
    }
  }
`;
