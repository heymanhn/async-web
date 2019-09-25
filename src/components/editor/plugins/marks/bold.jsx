/* eslint react/prop-types: 0 */
import React from 'react';
import {
  Hotkey,
  RenderMark,
} from '../helpers';

const BOLD = 'bold';

function Bold() {
  function renderBold(props) {
    const { attributes, children } = props;

    return <strong {...attributes}>{children}</strong>;
  }

  return [
    RenderMark(BOLD, renderBold),
    Hotkey('mod+b', editor => editor.toggleMark(BOLD)),
  ];
}

export default Bold;
