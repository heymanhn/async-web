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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStarted, setUploadStarted] = useState(false);

  const [uploadFile] = useMutation(uploadFileMutation, {
    variables: { messageId },
    onCompleted: (data) => {
      if (data && data.uploadFile) {
        const { url } = data.uploadFile;
        onFileUploaded(url);
      }
    },
  });
  const { getInputProps, open, acceptedFiles } = useDropzone({
    accept: 'image/*',
    maxSize: 10485760, // 10MB max
    multiple: false,
    noDrag: true,
    noClick: true,
    noKeyboard: true,
  });

  if (selectedFile && !uploadStarted) {
    setUploadStarted(true);
    uploadFile({ variables: { input: { file: selectedFile } } });
  }
  if (acceptedFiles.length > 0 && !selectedFile) {
    setSelectedFile(acceptedFiles[0]);
  }

  function openFileDialog() {
    if (selectedFile) setSelectedFile(null);
    if (uploadStarted) setUploadStarted(false);
    open();
  }

  return (
    <Container>
      <input {...getInputProps()} />
      <StyledButton
        onClick={openFileDialog}
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
