import gql from 'graphql-tag';

export default gql`
  mutation uploadFile($input: Object!) {
    uploadFile(input: $input)
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
