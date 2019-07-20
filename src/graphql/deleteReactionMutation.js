import gql from 'graphql-tag';

export default gql`
  mutation DeleteReaction($id: String!) {
    deleteReaction(id: $id) @rest(type: "Reaction", path: "/reactions/{args.id}", method: "DELETE") {
      success
    }
  }
`;
