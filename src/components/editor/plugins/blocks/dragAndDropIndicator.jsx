/* eslint react/prop-types: 0 */
import React from 'react';
import { Block } from 'slate';
import styled from '@emotion/styled';

import { AddSchema, AddCommands, AddQueries, RenderBlock } from '../helpers';

const DRAG_AND_DROP_INDICATOR = 'drag-and-drop-indicator';

export const indicatorNode = Block.create({ type: DRAG_AND_DROP_INDICATOR });

const StyledIndicator = styled.div(({ theme: { colors } }) => ({
  background: colors.blue,
  border: `1px solid ${colors.blue}`,
  borderRadius: '25px',
  height: '1px',
  margin: '-5px auto !important',
  width: '100%',
}));

function DragAndDropIndicator() {
  /* **** Schema **** */

  const indicatorSchema = {
    blocks: {
      'drag-and-drop-indicator': {
        isVoid: true,
      },
    },
  };

  /* **** Commands **** */

  function insertDragAndDropIndicator(editor) {
    if (editor.isEmptyParagraph()) return editor.setBlocks(DRAG_AND_DROP_INDICATOR);

    return editor
      .moveToEndOfBlock()
      .insertBlock(DRAG_AND_DROP_INDICATOR);
  }

  /* **** Queries **** */

  function findDragAndDropIndicator(editor) {
    return editor.value.document.findDescendant(n => n.type === DRAG_AND_DROP_INDICATOR);
  }

  /* **** Render methods **** */

  function renderIndicator(props) {
    const { attributes } = props;

    return (
      <StyledIndicator
        {...attributes}
      />
    );
  }

  return [
    AddSchema(indicatorSchema),
    AddCommands({ insertDragAndDropIndicator }),
    AddQueries({ findDragAndDropIndicator }),
    RenderBlock(DRAG_AND_DROP_INDICATOR, renderIndicator),
  ];
}

export default DragAndDropIndicator;
