import gql from 'graphql-tag';

export default gql`
  mutation CreateReaction($input: Object!) {
    createReaction(input: $input) @rest(type: "Reaction", path: "/reactions", method: "POST") {
      success
    }
  }
`;
