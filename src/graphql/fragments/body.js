import gql from 'graphql-tag';

export default gql`
  fragment BodyObject on Body {
    formatter
    payload
    text
  }
`;
