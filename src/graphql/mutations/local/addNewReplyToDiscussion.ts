import gql from 'graphql-tag';

export default gql`
  mutation AddNewReplyToDiscussion($isUnread: Boolean!, $reply: Object!) {
    addNewReplyToDiscussion(isUnread: $isUnread, reply: $reply) @client
  }
`;
