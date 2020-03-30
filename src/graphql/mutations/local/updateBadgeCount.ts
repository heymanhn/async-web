import gql from 'graphql-tag';

export default gql`
  mutation UpdateBadgeCount($resourceType: String!, $resourceId: String!, $incrementBy: Int!) {
    updateBadgeCount(resourceType: $resourceType, resourceId: $resourceId, incrementBy: $incrementBy) @client
  }
`;