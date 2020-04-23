import React, { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditor } from 'slate-react';

import { DocumentContext, DiscussionContext } from 'utils/contexts';
import { IMAGE_OPTION_TITLE } from 'utils/editor/constants';
import uploadImage from 'utils/imageUpload';

import Editor from 'components/editor/Editor';
import MenuOption from './MenuOption';
import OptionIcon from './OptionIcon';

const ImageOption = props => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const resourceId = documentId || discussionId;
  const editor = useEditor();

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length)
        uploadImage(editor, resourceId, acceptedFiles[0]);
    },
    [editor, resourceId]
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
