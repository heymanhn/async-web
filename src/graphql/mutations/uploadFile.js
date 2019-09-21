import gql from 'graphql-tag';

export default gql`
  mutation uploadFile($messageId: String!, $input: Object!) {
    uploadFile(messageId: $messageId, input: $input)
      @rest(
        type: "FileUpload",
        path: "/messages/{args.messageId}/files",
        method: "POST",
        bodySerializer: "file"
      ) {
        objectId
        fileId
        fileName
        fileSize
        fileS3Key
        url
        createdAt
      }
  }
`;
