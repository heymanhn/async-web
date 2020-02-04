/* eslint react/prop-types: 0 */
import React from 'react';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import { DEFAULT_NODE } from 'components/editor/utils';
import { AddCommands, AddQueries, AddSchema, RenderBlock } from '../helpers';

const IMAGE_LOADING_INDICATOR = 'image-loading-indicator';

/* **** Slate plugin **** */

const StyledImageLoadingIndicator = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '1em auto',
});

const StyledIndicator = styled(LoadingIndicator)({
  width: '30px',
  height: '30px',
});

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
      editor.insertBlock(DEFAULT_NODE).removeNodeByKey(indicator.key);
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
