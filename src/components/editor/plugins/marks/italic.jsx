import React from 'react';
import { faItalic } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import {
  Hotkey,
  RenderMark,
} from '../helpers';

const ITALIC = 'italic';

/* **** Toolbar button **** */

export function ItalicButton({ editor, ...props }) {
  const isActive = editor.hasActiveMark(ITALIC);

  function handleClick() {
    editor.toggleMark(ITALIC);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={faItalic} isActive={isActive} />
    </ToolbarButton>
  );
}

ItalicButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Slate plugin **** */

export function ItalicPlugin() {
  function renderItalic(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    return <em {...attributes}>{children}</em>;
  }

  return [
    RenderMark(ITALIC, renderItalic),
    Hotkey('mod+i', editor => editor.toggleMark(ITALIC)),
  ];
}
