import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import { faBold, faItalic } from '@fortawesome/free-solid-svg-icons';

import Editor from '../Editor';
import { BOLD, ITALIC } from '../utils';
import ToolbarButton from './ToolbarButton';
import ButtonIcon from './ButtonIcon';

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
