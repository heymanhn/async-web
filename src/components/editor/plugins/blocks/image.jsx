/* eslint react/prop-types: 0 */
import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';

import uploadFileMutation from 'graphql/mutations/uploadFile';
import { track } from 'utils/analytics';

import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import {
  DEFAULT_ELEMENT_TYPE,
  COMPOSITION_MENU_SOURCE,
  CUT_PASTE_SOURCE,
} from 'components/editor/utils';
import {
  AddCommands,
  AddSchema,
  CustomBackspaceAction,
  CustomEnterAction,
  CustomDropAction,
  CustomPasteAction,
  RenderBlock,
} from '../helpers';

const IMAGE = 'image';
export const IMAGE_OPTION_TITLE = 'Image';

/* **** Composition menu option **** */
/* The image option uploads an image to the editor */

export function ImageOption({ editor, ...props }) {
  const initialState = {
    selectedFile: null,
    uploadStarted: false,
  };
  const [state, setState] = useState(initialState);
  const { selectedFile, uploadStarted } = state;
  const { resourceId } = editor.props;

  const [uploadFile] = useMutation(uploadFileMutation, {
    variables: {
      resourceId,
    },
    onCompleted: data => {
      if (data && data.uploadFile) {
        const { url } = data.uploadFile;
        editor
          .removeImageLoadingIndicator()
          .insertImage(url, COMPOSITION_MENU_SOURCE);
      } else {
        editor.removeImageLoadingIndicator();
      }
    },
  });

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setState(oldState => ({ ...oldState, selectedFile: acceptedFiles[0] }));
    }
  }, []);

  const { getInputProps, open } = useDropzone({
    accept: 'image/*',
    maxSize: 10485760, // 10MB max
    multiple: false,
    noDrag: true,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  if (selectedFile && !uploadStarted) {
    setState(oldState => ({ ...oldState, uploadStarted: true }));
    editor.insertImageLoadingIndicator();
    uploadFile({ variables: { input: { file: selectedFile } } });
  }

  function openFileDialog() {
    editor.clearBlock();
    setState(initialState);
    open();
  }

  const icon = <OptionIcon icon="image" />;
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

  function insertImage(editor, imageSource, source) {
    track('Image inserted to content', { source });

    if (editor.isEmptyParagraph()) {
      return editor.setBlocks({
        type: IMAGE,
        data: { src: imageSource },
      });
    }

    return editor.moveToEndOfBlock().insertBlock({
      type: IMAGE,
      data: { src: imageSource },
    });
  }

  /* **** Custom keyboard actions **** */

  function insertNewBlockOnEnter(editor, next) {
    if (editor.hasBlock(IMAGE)) {
      return editor.insertBlock(DEFAULT_ELEMENT_TYPE);
    }

    return next();
  }

  // Need to ensure there's at least a text block present in the composer before the image
  // is deleted.
  function ensureBlockPresentOnRemove(editor, next) {
    if (editor.hasBlock(IMAGE)) {
      const { startBlock } = editor.value;
      const { key } = startBlock;

      return editor.insertBlock(DEFAULT_ELEMENT_TYPE).removeNodeByKey(key);
    }

    return next();
  }

  // Inspired by https://stackoverflow.com/questions/6333814/
  async function uploadAndInsertImage(items, editor, next) {
    let image;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.kind === 'file' && item.type.includes('image')) {
        image = item.getAsFile();
        break;
      }
    }
    if (!image) return next();

    const client = window.Roval.apolloClient; // Using a global variable until I find a better way
    editor.insertImageLoadingIndicator();
    const { resourceId } = editor.props;
    const { data } = await client.mutate({
      mutation: uploadFileMutation,
      variables: { resourceId, input: { file: image } },
    });

    if (data && data.uploadFile) {
      const { url } = data.uploadFile;
      return editor
        .removeImageLoadingIndicator()
        .insertImage(url, CUT_PASTE_SOURCE);
    }

    editor.removeImageLoadingIndicator();
    return next();
  }

  async function insertImageOnPaste(event, editor, next) {
    const { clipboardData } = event;
    const { items } = clipboardData;

    const response = await uploadAndInsertImage(items, editor, next);
    return response;
  }

  async function insertImageOnDrop(event, editor, next) {
    const { dataTransfer } = event;
    const { items } = dataTransfer;

    const response = await uploadAndInsertImage(items, editor, next);
    return response;
  }

  return [
    AddSchema(imageSchema),
    AddCommands({ insertImage }),
    RenderBlock(IMAGE, renderImage),
    CustomBackspaceAction(ensureBlockPresentOnRemove),
    CustomEnterAction(insertNewBlockOnEnter),
    CustomDropAction(insertImageOnDrop),
    CustomPasteAction(insertImageOnPaste),
  ];
}
