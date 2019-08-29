import gql from 'graphql-tag';

export default gql`
  query IsUserLoggedIn {
    isLoggedIn @client
    saveStatus @client
  }
`;
