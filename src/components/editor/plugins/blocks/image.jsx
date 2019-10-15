/* eslint react/prop-types: 0 */
import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import { useDropzone } from 'react-dropzone';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import uploadFileMutation from 'graphql/mutations/uploadFile';

import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import { DEFAULT_NODE } from 'components/editor/defaults';
import {
  AddCommands,
  AddSchema,
  CustomBackspaceAction,
  CustomEnterAction,
  RenderBlock,
} from '../helpers';

const IMAGE = 'image';
export const IMAGE_OPTION_TITLE = 'Image';

/* **** Composition menu option **** */
/* The image option uploads an image to the editor */

export function ImageOption({ editor, ...props }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStarted, setUploadStarted] = useState(false);

  const [uploadFile] = useMutation(uploadFileMutation, {
    onCompleted: (data) => {
      if (data && data.uploadFile) {
        const { url } = data.uploadFile;
        editor.insertImage(url);
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
    editor.clearBlock();
    if (selectedFile) setSelectedFile(null);
    if (uploadStarted) setUploadStarted(false);
    open();
  }

  const icon = <OptionIcon icon={faImage} />;
  return (
    <>
      <input {...getInputProps()} />
      <MenuOption
        handleInvoke={openFileDialog}
        icon={icon}
        title={IMAGE_OPTION_TITLE}
        {...props}
      />
    </>
  );
}

/* **** Slate plugin **** */

const StyledImage = styled.img(({ isFocused, readOnly, theme: { colors } }) => ({
  display: 'block',
  margin: '1em auto',
  maxWidth: '100%',
  maxHeight: '20em',
  boxShadow: `${isFocused ? `0 0 0 3px ${colors.blue}` : 'none'}`,

  ':hover': {
    boxShadow: readOnly ? 'none' : `0 0 0 3px ${colors.blue}`,
  },
}));

export function Image() {
  /* **** Schema **** */

  const imageSchema = {
    blocks: {
      image: {
        isVoid: true,
      },
    },
  };

  /* **** Commands **** */

  function insertImage(editor, src) {
    if (editor.isEmptyParagraph()) {
      return editor.setBlocks({
        type: IMAGE,
        data: { src },
      });
    }

    return editor
      .moveToEndOfBlock()
      .insertBlock({
        type: IMAGE,
        data: { src },
      });
  }

  /* **** Render methods **** */

  function renderImage(props) {
    const { attributes, isFocused, node, readOnly } = props;

    const src = node.data.get('src');
    return (
      <StyledImage
        {...attributes}
        src={src}
        isFocused={isFocused}
        readOnly={readOnly}
      />
    );
  }

  /* **** Custom keyboard actions **** */

  function insertNewBlockOnEnter(editor, next) {
    if (editor.hasBlock(IMAGE)) {
      return editor.insertBlock(DEFAULT_NODE);
    }

    return next();
  }

  // Need to ensure there's at least a text block present in the composer before the image
  // is deleted.
  function ensureBlockPresentOnRemove(editor, next) {
    if (editor.hasBlock(IMAGE)) {
      const { startBlock } = editor.value;
      const { key } = startBlock;

      return editor
        .insertBlock(DEFAULT_NODE)
        .removeNodeByKey(key);
    }

    return next();
  }

  return [
    AddSchema(imageSchema),
    AddCommands({ insertImage }),
    RenderBlock(IMAGE, renderImage),
    CustomBackspaceAction(ensureBlockPresentOnRemove),
    CustomEnterAction(insertNewBlockOnEnter),
  ];
}
