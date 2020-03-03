import React, { useState } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useSelectionDimensions from 'utils/hooks/useSelectionDimensions';

import Editor from 'components/editor/Editor';
import CompositionMenuPlaceholder from './CompositionMenuPlaceholder';
import CompositionMenu from './CompositionMenu';

const ButtonContainer = styled.div(
  ({ isVisible, theme: { colors } }) => ({
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
  }),
  ({ coords, isVisible }) => {
    if (!isVisible || !coords) return {};

    const { top, left } = coords;
    return { opacity: 1, top, left };
  }
);

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const CompositionMenuButton = props => {
  const editor = useSlate();
  const [state, setState] = useState({
    isMenuOpen: false,
    isMenuDismissed: false, // distinguishing a user action
    isKeyboardInvoked: false,
  });
  const { isMenuOpen, isMenuDismissed, isKeyboardInvoked } = state;
  const showButton =
    ReactEditor.isFocused(editor) &&
    !isMenuOpen &&
    Editor.isEmptyParagraph(editor);
  const { coords } = useSelectionDimensions({ skip: !showButton });

  // Don't let the button handle the event, so that it won't reset its visibility
  const handleMouseDown = event => event.preventDefault();

  // Only called when menu invoked via the button
  const handleOpenMenu = event => {
    event.preventDefault();
    ReactEditor.focus(editor);
    setState(oldState => ({ ...oldState, isMenuOpen: true }));
  };

  // The order of these setState calls matters
  const handleCloseMenu = () => {
    setState(oldState => ({
      ...oldState,
      isMenuOpen: false,
      isMenuDismissed: true,
      isKeyboardInvoked: false,
    }));
  };

  // Only clears formatting from the previous character, assuming that a slash
  // command was activated.
  const resetFormatting = () => {
    Transforms.move(editor, {
      edge: 'anchor',
      reverse: true,
    });
    Editor.removeAllMarks(editor);
    Transforms.collapse(editor, { edge: 'focus' });
  };

  if (Editor.isWrappedBlock(editor)) return null;

  if (Editor.isSlashCommand(editor) && !isKeyboardInvoked && !isMenuDismissed) {
    resetFormatting();
    setState(oldState => ({ ...oldState, isKeyboardInvoked: true }));
  }

  if (isKeyboardInvoked && !isMenuOpen) {
    setState(oldState => ({ ...oldState, isMenuOpen: true }));
  }

  // In order to dismiss the menu when the user removes a slash command
  if (Editor.isEmptyParagraph(editor) && isKeyboardInvoked) {
    setState(oldState => ({
      ...oldState,
      isKeyboardInvoked: false,
      isMenuOpen: false,
      isMenuDismissed: false,
    }));
  }

  // Reset the dismiss flag so that the menu can be keyboard-invoked again
  if (
    Editor.isEmptyParagraph(editor) &&
    !isKeyboardInvoked &&
    isMenuDismissed
  ) {
    setState(oldState => ({ ...oldState, isMenuDismissed: false }));
  }

  const adjustedCoords = () => {
    if (!showButton || !coords) return null;

    const { top, left } = coords;
    return {
      top: `${top - 7}px`, // 7px is half of 15px button height
      left: `${left - 45}px`, // 30px margin + half of 30px button width
    };
  };

  return (
    <>
      <ButtonContainer
        coords={adjustedCoords()}
        isVisible={showButton}
        onClick={handleOpenMenu}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <StyledIcon icon={['fal', 'plus']} />
      </ButtonContainer>
      {showButton && <CompositionMenuPlaceholder isVisible={showButton} />}
      <CompositionMenu handleClose={handleCloseMenu} isOpen={isMenuOpen} />
    </>
  );
};

export default CompositionMenuButton;
