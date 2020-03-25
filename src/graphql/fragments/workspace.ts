import gql from 'graphql-tag';

import user from 'graphql/fragments/user';

export default gql`
  fragment WorkspaceObject on Workspace {
    id
    title
    owner @type(name: "User") {
      ...UserObject
    }
    organizationId
    accessType
    createdAt
    updatedAt
  }
  ${user}
`;
