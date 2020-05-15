import gql from 'graphql-tag';

export default gql`
  mutation DeleteUserResource($resourceId: String!) {
    deleteUserResource(resourceId: $resourceId) @client
  }
`;
