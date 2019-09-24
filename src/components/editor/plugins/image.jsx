import React from 'react';
import styled from '@emotion/styled';

const StyledImage = styled.img(({ isFocused, theme: { colors } }) => ({
  display: 'block',
  margin: '10px auto',
  maxWidth: '100%',
  maxHeight: '20em',
  boxShadow: `${isFocused ? `0 0 0 3px ${colors.blue}` : 'none'}`,

  ':hover': {
    boxShadow: `0 0 0 3px ${colors.blue}`,
  },
}));

function Image() {
  return {
    commands: {
      insertImage(editor, src) {
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
      },
    },

    renderBlock(props, editor, next) {
      const { attributes, isFocused, node } = props;

      if (node.type === 'image') {
        const src = node.data.get('src');
        return (
          <StyledImage
            {...attributes}
            src={src}
            isFocused={isFocused}
          />
        );
      }

      return next();
    },

    schema: {
      blocks: {
        image: {
          isVoid: true,
        },
      },
    },
  };
}

export default Image;
