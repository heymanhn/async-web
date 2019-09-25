/* eslint react/prop-types: 0 */
import React from 'react';
import {
  Hotkey,
  RenderMark,
} from '../helpers';

const ITALIC = 'italic';

function Italic() {
  function renderItalic(props) {
    const { attributes, children } = props;

    return <em {...attributes}>{children}</em>;
  }

  return [
    RenderMark(ITALIC, renderItalic),
    Hotkey('mod+i', editor => editor.toggleMark(ITALIC)),
  ];
}

export default Italic;
