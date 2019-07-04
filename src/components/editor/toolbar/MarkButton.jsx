/* eslint jsx-a11y/click-events-have-key-events: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const StyledIcon = styled(FontAwesomeIcon)(({ isactive, theme: { colors } }) => ({
  color: isactive === 'true' ? colors.selectedValueBlue : colors.bgGrey,
  cursor: 'pointer',
  margin: '5px 10px',

  ':hover': {
    color: colors.selectedValueBlue,
  },
}));

const MarkButton = ({ editor, type }) => {
  const isActive = editor.hasActiveMark(type);
  const iconForType = {
    bold: faBold,
    italic: faItalic,
  };
  const handleClick = (event) => {
    event.preventDefault();
    editor.toggleMark(type);
  };

  return (
    <StyledIcon
      icon={iconForType[type]}
      isactive={isActive.toString()}
      onMouseDown={handleClick}
    />
  );
};

MarkButton.propTypes = {
  editor: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default MarkButton;
