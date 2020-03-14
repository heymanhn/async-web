/* eslint react/prop-types: 0 */
import React from 'react';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import { DEFAULT_ELEMENT_TYPE } from 'components/editor/utils';
import { AddCommands, AddQueries, AddSchema, RenderBlock } from '../helpers';

const IMAGE_LOADING_INDICATOR = 'image-loading-indicator';

/* **** Slate plugin **** */

export default function ImageLoadingIndicator() {
  /* **** Schema **** */

  const imageLoadingIndicatorSchema = {
    blocks: {
      'image-loading-indicator': {
        isVoid: true,
      },
    },
  };

  /* **** Commands **** */

  function insertImageLoadingIndicator(editor) {
    if (editor.isEmptyParagraph()) {
      return editor.setBlocks(IMAGE_LOADING_INDICATOR);
    }

    return editor.moveToEndOfBlock().insertBlock(IMAGE_LOADING_INDICATOR);
  }

  function removeImageLoadingIndicator(editor) {
    const indicator = editor.findImageLoadingIndicator();
    if (indicator) {
      editor.insertBlock(DEFAULT_ELEMENT_TYPE).removeNodeByKey(indicator.key);
    }

    return editor;
  }

  /* **** Queries **** */

  function findImageLoadingIndicator(editor) {
    return editor.value.document.findDescendant(
      n => n.type === IMAGE_LOADING_INDICATOR
    );
  }

  /* **** Render methods **** */

  function renderImageLoadingIndicator(props) {
    const { attributes } = props;

    return (
      <StyledImageLoadingIndicator {...attributes}>
        <StyledIndicator />
      </StyledImageLoadingIndicator>
    );
  }

  return [
    AddSchema(imageLoadingIndicatorSchema),
    AddCommands({ insertImageLoadingIndicator, removeImageLoadingIndicator }),
    AddQueries({ findImageLoadingIndicator }),
    RenderBlock(IMAGE_LOADING_INDICATOR, renderImageLoadingIndicator),
  ];
}
