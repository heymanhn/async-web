import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import {
  faBold,
  faItalic,
  faCode,
  faQuoteRight,
} from '@fortawesome/free-solid-svg-icons';

import Editor from '../Editor';
import { BOLD, ITALIC, CODE_BLOCK, BLOCK_QUOTE } from '../utils';
import ToolbarButton from './ToolbarButton';
import ButtonIcon from './ButtonIcon';

/*
 * Buttons for marks: bold, italic, etc.
 */
function MarkButton({ type, icon, ...props }) {
  const editor = useSlate();
  const isActive = Editor.isMarkActive(editor, type);

  function handleClick() {
    Editor.toggleMark(editor, type);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={icon} isActive={isActive} />
    </ToolbarButton>
  );
}

MarkButton.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};

export const BoldButton = () => <MarkButton type={BOLD} icon={faBold} />;
export const ItalicButton = () => <MarkButton type={ITALIC} icon={faItalic} />;

/*
 * Buttons for blocks: lists, block quotes, etc.
 */
function BlockButton({ type, icon, ...props }) {
  const editor = useSlate();
  const isActive = Editor.isBlockActive(editor, type);

  function handleClick() {
    Editor.toggleBlock(editor, type);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={icon} isActive={isActive} />
    </ToolbarButton>
  );
}

BlockButton.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};

export const CodeBlockButton = () => (
  <BlockButton type={CODE_BLOCK} icon={faCode} />
);
export const BlockQuoteButton = () => (
  <BlockButton type={BLOCK_QUOTE} icon={faQuoteRight} />
);
