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

const CompositionMenuButton = React.forwardRef(({ editor, query, ...props }, menuRef) => {
  const [state, setState] = useState({
    coords: null,
    isMenuOpen: false,
    isMenuDismissed: false, // distinguishing a user action
    isKeyboardInvoked: false,
  });
  const { value } = editor;
  const { selection } = value;

  // Don't let the button handle the event, so that it won't reset its visibility
  function handleMouseDown(event) {
    event.preventDefault();
  }

  // Only called when menu invoked via the button
  function handleOpenMenu(event) {
    event.preventDefault();
    editor.focus();
    setState(oldState => ({ ...oldState, isMenuOpen: true }));
  }

  // The order of these setState calls matters
  function handleCloseMenu() {
    setState(oldState => ({
      ...oldState,
      isMenuOpen: false,
      isMenuDismissed: true,
      isKeyboardInvoked: false,
    }));
  }

  function updateButtonPosition() {
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const { coords } = state;

    const newCoords = {
      top: `${rect.top + window.pageYOffset - 7}px`, // 7px is half of 15px button height
      left: `${rect.left + window.pageXOffset - 45}px`, // 30px margin + half of 30px width
    };

    if (coords && newCoords.top === state.coords.top && newCoords.left === coords.left) return;

    setState(oldState => ({ ...oldState, coords: newCoords }));
  }

  if (editor.isWrappedByAnyBlock()) return null;

  const { coords, isMenuOpen, isMenuDismissed, isKeyboardInvoked } = state;
  const showButton = selection.isFocused
    && !isMenuOpen
    && editor.isEmptyParagraph();

  if (showButton) setTimeout(updateButtonPosition, 0);
  if (!showButton && coords) {
    setState(oldState => ({ ...oldState, coords: null }));
  }
  if (editor.isSlashCommand() && !isKeyboardInvoked && !isMenuDismissed) {
    setState(oldState => ({ ...oldState, isKeyboardInvoked: true }));
  }
  if (isKeyboardInvoked && !isMenuOpen) {
    setState(oldState => ({ ...oldState, isMenuOpen: true }));
  }

  // In order to dismiss the menu when the user removes a slash command
  if (editor.isEmptyBlock() && isKeyboardInvoked) {
    setState(oldState => ({
      ...oldState,
      isKeyboardInvoked: false,
      isMenuOpen: false,
      isMenuDismissed: false,
    }));
  }

  // Reset the dismiss flag so that the menu can be keyboard-invoked again
  if (editor.isEmptyBlock() && !isKeyboardInvoked && isMenuDismissed) {
    setState(oldState => ({ ...oldState, isMenuDismissed: false }));
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
        ref={menuRef}
        editor={editor}
        handleClose={handleCloseMenu}
        isOpen={isMenuOpen}
      />
    </>
  );
});

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
