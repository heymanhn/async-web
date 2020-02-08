import gql from 'graphql-tag';

export default gql`
  mutation AddMember($objectType: String!, $id: String!, $input: Object!) {
    addMember(objectType: $objectType, id: $id, input: $input) @rest(type: "Success", path: "/{args.objectType}/{args.id}/access", method: "POST") {
      success
    }
  }
`;
