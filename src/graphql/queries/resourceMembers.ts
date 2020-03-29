import gql from 'graphql-tag';
import user from 'graphql/fragments/user';

export default gql`
  query ResourceMembers($resourceType: String!, $resourceId: String!) {
    resourceMembers(resourceType: $resourceType, resourceId: $resourceId)
      @rest(
        type: "ResourceMembers"
        path: "/{args.resourceType}/{args.resourceId}/members"
        method: "GET"
      ) {
      members @type(name: "[Member]") {
        user @type(name: "User") {
          ...UserObject
        }
        accessType
      }
    }
  }
  ${user}
`;
