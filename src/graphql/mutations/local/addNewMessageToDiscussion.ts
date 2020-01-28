import gql from 'graphql-tag';

export default gql`
  mutation AddNewMessageToDiscussion($isUnread: Boolean!, $message: Object!) {
    addNewMessageToDiscussion(isUnread: $isUnread, message: $message) @client
  }
`;
