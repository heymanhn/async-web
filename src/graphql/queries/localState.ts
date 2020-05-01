import gql from 'graphql-tag';

export default gql`
  query LocalState {
    isLoggedIn @client
    isOnboarding @client
    pendingMessages @client
  }
`;
