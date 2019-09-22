import gql from 'graphql-tag';

export default gql`
  mutation uploadFile($messageId: String!, $input: Object!) {
    uploadFile(messageId: $messageId, input: $input)
      @rest(
        type: "FileUpload",
        path: "/attachments",
        method: "POST",
        bodySerializer: "file"
      ) {
        id
        fileName
        fileSize
        fileS3Key
        url
        createdAt
      }
  }
`;
