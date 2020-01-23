import gql from 'graphql-tag';

import user from 'graphql/fragments/user';

export default gql`
  query DocumentParticipants($id: String!) {
    documentParticipants(id: $id) @rest(type: "DocumentParticipants", path: "/documents/{args.id}/participants", method: "GET") {
      participants @type(name: "[Participant]") {
        user @type(name: "User") {
          ...UserObject
        }
        accessType
      }
    }
  }
  ${user}
`;
