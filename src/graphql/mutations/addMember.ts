import gql from 'graphql-tag';

export default gql`
  mutation AddMember($resourceType: String!, $id: String!, $input: Object!) {
    addMember(resourceType: $resourceType, id: $id, input: $input)
      @rest(
        type: "AddResourceMember"
        path: "/{args.resourceType}/{args.id}/access"
        method: "POST"
      ) {
      success
    }
  }
`;
