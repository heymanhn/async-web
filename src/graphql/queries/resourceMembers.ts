import gql from 'graphql-tag';
import user from 'graphql/fragments/user';

export default gql`
  query ResourceMembers($resourceType: String!, $id: String!) {
    resourceMembers(resourceType: $resourceType, id: $id)
      @rest(
        type: "ResourceMembers"
        path: "/{args.resourceType}/{args.id}/members"
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
