import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditor } from 'slate-react';

import useImageUpload from 'utils/hooks/useImageUpload';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import { IMAGE_OPTION_TITLE } from '../utils';
import Editor from '../Editor';
import MenuOption from './MenuOption';
import OptionIcon from './OptionIcon';

const ImageOption = props => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const resourceId = documentId || discussionId;
  const uploadImage = useImageUpload(resourceId);
  const editor = useEditor();

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length) uploadImage(acceptedFiles[0]);
    },
    [uploadImage]
  );

  const { getInputProps, open } = useDropzone({
    accept: 'image/*',
    maxSize: 10485760, // 10MB max
    multiple: false,
    noDrag: true,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const openFileDialog = () => {
    Editor.clearBlock(editor);
    setTimeout(open);
  };

  return (
    <>
      <input {...getInputProps()} />
      <MenuOption
        handleInvoke={openFileDialog}
        icon={<OptionIcon icon="image" />}
        title={IMAGE_OPTION_TITLE}
        {...props}
      />
    </>
  );
};

export default ImageOption;
