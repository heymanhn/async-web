import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faListUl, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import CustomHeadingIcon from './CustomHeadingIcon';

const StyledIcon = styled(FontAwesomeIcon)(({ isactive, theme: { colors } }) => ({
  color: isactive === 'true' ? colors.selectedValueBlue : colors.bgGrey,
  cursor: 'pointer',
  margin: '5px 10px',

  ':hover': {
    color: colors.selectedValueBlue,
  },
}));

const BlockButton = ({ editor, type }) => {
  const isActiveBlock = () => {
    let isActive = editor.hasBlock(type);

    if (['block-quote', 'code-block'].includes(type)) {
      const { value: { document, blocks } } = editor;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = parent && parent.type === type;
      }
    }

    // For lists, need to traverse upwards to find whether the list type matches
    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = editor;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = editor.hasBlock('list-item') && parent && parent.type === type;
      }
    }

    return isActive;
  };

  const iconForType = {
    'block-quote': faQuoteRight,
    'bulleted-list': faListUl,
    'code-block': faCode,
  };

  const handleClick = (event) => {
    event.preventDefault();

    // HN: can I DRY this up in the lists plugin?
    if (['bulleted-list', 'numbered-list'].includes(type)) return editor.setListBlock(type);
    return editor.setBlock(type);
  };

  if (type.includes('heading')) {
    return (
      <CustomHeadingIcon
        number={type === 'heading-one' ? 1 : 2}
        isactive={isActiveBlock()}
        onMouseDown={handleClick}
      />
    );
  }

  return (
    <StyledIcon
      icon={iconForType[type]}
      isactive={isActiveBlock().toString()}
      onMouseDown={handleClick}
    />
  );
};

BlockButton.propTypes = {
  editor: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default BlockButton;
