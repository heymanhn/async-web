import gql from 'graphql-tag';

export default gql`
  query LocalState {
    isLoggedIn @client
    selectedMeetingId @client
  }
`;
