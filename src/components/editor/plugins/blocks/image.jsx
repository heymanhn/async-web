/* eslint react/prop-types: 0 */
import React from 'react';
import styled from '@emotion/styled';

import { AddCommand, AddSchema, RenderBlock } from '../helpers';

const StyledImage = styled.img(({ isFocused, readOnly, theme: { colors } }) => ({
  display: 'block',
  margin: '10px auto',
  maxWidth: '100%',
  maxHeight: '20em',
  boxShadow: `${isFocused ? `0 0 0 3px ${colors.blue}` : 'none'}`,

  ':hover': {
    boxShadow: readOnly ? 'none' : `0 0 0 3px ${colors.blue}`,
  },
}));

function Image() {
  function insertImage(editor, src) {
    if (editor.isEmptyParagraph()) {
      return editor.setBlock({
        type: 'image',
        data: { src },
      });
    }

    return editor
      .moveToEndOfBlock()
      .insertBlock({
        type: 'image',
        data: { src },
      });
  }

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

  const imageSchema = {
    blocks: {
      image: {
        isVoid: true,
      },
    },
  };

  return [
    AddCommand({ insertImage }),
    AddSchema(imageSchema),
    RenderBlock('image', renderImage),
  ];
}

export default Image;
