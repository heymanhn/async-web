/* eslint react/prop-types: 0 */
import React from 'react';
import {
  Hotkey,
  RenderMark,
} from '../helpers';

const UNDERLINED = 'underlined';

function Underlined() {
  function renderUnderlined(props) {
    const { attributes, children } = props;

    return <u {...attributes}>{children}</u>;
  }

  return [
    RenderMark(UNDERLINED, renderUnderlined),
    Hotkey('mod+u', editor => editor.toggleMark(UNDERLINED)),
  ];
}

export default Underlined;
