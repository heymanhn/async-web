import gql from 'graphql-tag';

export default gql`
  mutation DeleteResourceFromInbox(
    $resourceType: String!
    $resourceId: String!
  ) {
    deleteResourceFromInbox(
      resourceType: $resourceType
      resourceId: $resourceId
    ) @client
  }
`;
