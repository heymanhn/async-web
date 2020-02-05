import React from 'react';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import { Hotkey, RenderMark } from '../helpers';

const BOLD = 'bold';

/* **** Toolbar button **** */

export function BoldButton({ editor, ...props }) {
  const isActive = editor.hasActiveMark(BOLD);

  function handleClick() {
    editor.toggleMark(BOLD);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={faBold} isActive={isActive} />
    </ToolbarButton>
  );
}

BoldButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Slate plugin **** */

export function BoldPlugin() {
  function renderBold(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    return <strong {...attributes}>{children}</strong>;
  }

  return [
    RenderMark(BOLD, renderBold),
    Hotkey('mod+b', editor => editor.toggleMark(BOLD)),
  ];
}

export const BoldHotkey = {};
