import gql from 'graphql-tag';

export default gql`
  mutation AddNewPendingMessage($message: Object!) {
    addNewPendingMessage(message: $message) @client
  }
`;
