import gql from 'graphql-tag';

export default gql`
  mutation MarkResourceAsRead($resource: Object!, $reaction: Object!) {
    markResourceAsRead(resource: $resource, reaction: $reaction) @client
  }
`;
