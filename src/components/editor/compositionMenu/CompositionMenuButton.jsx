import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import styled from '@emotion/styled';

import CompositionMenu from './CompositionMenu';

const ButtonContainer = styled.div(({ isVisible, theme: { colors } }) => ({
  display: isVisible ? 'flex' : 'none',
  justifyContent: 'center',
  alignItems: 'center',
  top: '-10000px',
  left: '-10000px',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  opacity: 0,
  transition: 'opacity 0.1s',
  width: '30px',
  height: '30px',
  position: 'absolute',

  ':hover': {
    background: colors.formGrey,
  },
}), ({ coords, isVisible }) => {
  if (!isVisible || !coords) return {};

  const { top, left } = coords;
  return { opacity: 1, top, left };
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const CompositionMenuButton = ({ editor, query, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isKeyboardInvoked, setIsKeyboardInvoked] = useState(false);
  const [coords, setCoords] = useState(null);
  const { value } = editor;
  const { selection } = value;

  // Don't let the button handle the event, so that it won't reset its visibility
  function handleMouseDown(event) {
    event.preventDefault();
  }
  function handleOpenMenu(event) {
    event.preventDefault();
    editor.focus();
    setIsMenuOpen(true);
  }

  // In the future, also need to reset the menu
  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function updateButtonPosition() {
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const newCoords = {
      top: `${rect.top + window.pageYOffset - 7}px`, // 7px is half of 15px button height
      left: `${rect.left + window.pageXOffset - 45}px`, // 30px margin + half of 30px width
    };

    if (coords && newCoords.top === coords.top && newCoords.left === coords.left) return;

    setCoords(newCoords);
  }

  if (editor.isWrappedByAnyBlock()) return null;

  const showButton = selection.isFocused
    && !isMenuOpen
    && editor.isEmptyParagraph();

  if (showButton) setTimeout(updateButtonPosition, 0);
  if (!showButton && coords) setCoords(null);
  if (editor.isSlashCommand() && !isKeyboardInvoked) setIsKeyboardInvoked(true);
  if (isKeyboardInvoked) {
    if (editor.isEmptyBlock()) {
      setIsKeyboardInvoked(false);
      setIsMenuOpen(false);
    } else if (!isMenuOpen) setIsMenuOpen(true);
  }

  return (
    <>
      <ButtonContainer
        coords={coords}
        isVisible={showButton}
        onClick={handleOpenMenu}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <StyledIcon icon={faPlus} />
      </ButtonContainer>
      <CompositionMenu
        editor={editor}
        handleClose={handleCloseMenu}
        isOpen={isMenuOpen}
      />
    </>
  );
};

CompositionMenuButton.propTypes = {
  editor: PropTypes.object.isRequired,
  query: PropTypes.string,
  range: PropTypes.object,
};

CompositionMenuButton.defaultProps = {
  query: '',
  range: null,
};

export default CompositionMenuButton;
