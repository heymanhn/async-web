import gql from 'graphql-tag';

export default gql`
  mutation AddNewMessageToConversation($isUnread: Boolean!, $message: Object!) {
    addNewMessageToConversation(isUnread: $isUnread, message: $message) @client
  }
`;
