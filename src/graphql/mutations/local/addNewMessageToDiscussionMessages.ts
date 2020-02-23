import gql from 'graphql-tag';

export default gql`
  mutation AddNewMessageToDiscussionMessages(
    $isUnread: Boolean!
    $message: Object!
  ) {
    addNewMessageToDiscussionMessages(isUnread: $isUnread, message: $message)
      @client
  }
`;
