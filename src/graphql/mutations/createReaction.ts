import gql from 'graphql-tag';

import reaction from 'graphql/fragments/reaction';

export default gql`
  mutation CreateReaction($input: Object!) {
    createReaction(input: $input)
      @rest(type: "Reaction", path: "/reactions", method: "POST") {
      ...ReactionObject
    }
  }
  ${reaction}
`;
