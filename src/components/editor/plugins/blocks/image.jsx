/* eslint react/prop-types: 0 */
import React from 'react';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';

import { AddCommands, AddSchema, RenderBlock } from '../helpers';

const IMAGE = 'image';

/* **** Composition menu option **** */

export function ImageOption({ editor, ...props }) {
  function handleClick() {
    // TODO
  }

  const icon = <OptionIcon icon={faImage} />;

  return (
    <MenuOption
      handleClick={handleClick}
      icon={icon}
      title="Image"
      {...props}
    />
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

function Image() {
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

  return [
    AddSchema(imageSchema),
    AddCommands({ insertImage }),
    RenderBlock(IMAGE, renderImage),
  ];
}

export default Image;
