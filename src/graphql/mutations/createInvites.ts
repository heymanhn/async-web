import gql from 'graphql-tag';

export default gql`
  mutation CreateInvites($organizationId: String!, $input: Object!) {
    createInvites(organizationId: $organizationId, input: $input) @rest(type: "CreateInvites", path: "/organizations/{args.organizationId}/invites", method: "POST") {
      success
    }
  }
`;
