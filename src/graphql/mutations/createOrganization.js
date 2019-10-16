import gql from 'graphql-tag';

export default gql`
  mutation CreateOrganization($input: Object!) {
    createOrganization(input: $input) @rest(type: "Organization", path: "/organizations", method: "POST") {
      id
      title
    }
  }
`;
