/*
 * TEMPORARY COMPONENT for demo purposes
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';

import uploadFileMutation from 'graphql/mutations/uploadFile';

import Button from 'components/shared/Button';

const Container = styled.div({
  position: 'absolute',
  top: '20px',
  right: '20px',
});

const StyledButton = styled(Button)({
  margin: 0,
});

const FileUploadButton = ({ messageId, onFileUploaded }) => {
  // Stupid state to make file upload work once only
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const [uploadFile, { loading, error, data }] = useMutation(uploadFileMutation, {
    variables: { messageId },
  });
  const { getInputProps, open, acceptedFiles } = useDropzone({
    accept: 'image/*',
    maxSize: 10485760, // 10MB max
    multiple: false,
    noDrag: true,
    noClick: true,
    noKeyboard: true,
  });

  if (acceptedFiles.length && !loading && !error && !data && !isFileUploaded) {
    uploadFile({ variables: { input: { file: acceptedFiles[0] } } });
  }

  if (data && !isFileUploaded) {
    const { url } = data.uploadFile;
    onFileUploaded(url);
    setIsFileUploaded(true);
  }

  return (
    <Container>
      <input {...getInputProps()} />
      <StyledButton
        onClick={open}
        type="grey"
        title="Add image"
      />
    </Container>
  );
};

FileUploadButton.propTypes = {
  messageId: PropTypes.string.isRequired,
  onFileUploaded: PropTypes.func.isRequired,
};

export default FileUploadButton;
