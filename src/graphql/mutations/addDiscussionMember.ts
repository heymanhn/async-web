import gql from 'graphql-tag';

export default gql`
  mutation AddDiscussionMember($id: String!, $input: Object!) {
    addDiscussionMember(id: $id, input: $input) @rest(type: "Success", path: "/discussions/{args.id}/access", method: "POST") {
      success
    }
  }
`;
