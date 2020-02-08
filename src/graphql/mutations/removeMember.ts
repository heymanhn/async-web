import gql from 'graphql-tag';

export default gql`
  mutation RemoveMember($objectType: String!, $id: String!, $userId: String!) {
    removeMember(objectType: $objectType, id: $id, userId: $userId) @rest(type: "Success", path: "/{args.objectType}/{args.id}/access?user_id={args.userId}", method: "DELETE") {
      success
    }
  }
`;
