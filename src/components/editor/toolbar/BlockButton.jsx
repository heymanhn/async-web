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
  const isActive = editor.hasBlock(type);
  const iconForType = {
    'block-quote': faQuoteRight,
    'bulleted-list': faListUl,
    'code-block': faCode,
  };
  const handleClick = (event) => {
    event.preventDefault();
    editor.setBlock(type);
  };

  if (type.includes('heading')) {
    return (
      <CustomHeadingIcon
        number={type === 'heading-one' ? 1 : 2}
        isactive={isActive}
        onMouseDown={handleClick}
      />
    );
  }

  return (
    <StyledIcon
      icon={iconForType[type]}
      isactive={isActive.toString()}
      onMouseDown={handleClick}
    />
  );
};

BlockButton.propTypes = {
  editor: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default BlockButton;
