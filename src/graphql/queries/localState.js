import gql from 'graphql-tag';

import message from 'graphql/fragments/message';

export default gql`
  query LocalState {
    isLoggedIn @client
    isOnboarding @client
    pendingMessages @client {
      ...MessageObject
    }
    selectedMeetingId @client
  }
  ${message}
`;
