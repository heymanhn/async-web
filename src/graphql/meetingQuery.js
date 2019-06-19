import gql from 'graphql-tag';

export default gql`
  query Meeting($id: String!) {
    meeting(id: $id) @rest(type: "Meeting", path: "/meetings/{args.id}") {
      id
      title
      body @type(name: "[Body]") {
        formatter
        payload
      }
    }
  }
`;
