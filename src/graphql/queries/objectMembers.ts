import gql from 'graphql-tag';
import user from 'graphql/fragments/user';

export default gql`
  query ObjectMembers($objectType: String!, $id: String!) {
    objectMembers(objectType: $objectType, id: $id) @rest(type: "ObjectMembers", path: "/{args.objectType}/{args.id}/members", method: "GET") {
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
