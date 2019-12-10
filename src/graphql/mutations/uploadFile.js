import gql from 'graphql-tag';

export default gql`
  mutation uploadFile($resourceId: String!, $input: Object!) {
    uploadFile(resourceId: $resourceId, input: $input)
      @rest(
        type: "FileUpload",
        path: "/resources/{args.resourceId}/attachments",
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
