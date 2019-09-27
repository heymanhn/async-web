/* eslint react/prop-types: 0 */
import React from 'react';
import PasteLinkify from 'slate-paste-linkify';

import {
  AddCommands,
  AddQueries,
  RenderInline,
} from '../helpers';

function Link() {
  /* **** Commands **** */

  function wrapLink(editor, url) {
    return editor.wrapInline({ type: 'link', data: { url } });
  }

  function unwrapLink(editor) {
    return editor.unwrapInline('link');
  }

  /* **** Queries **** */

  function isLinkActive(editor, value) {
    return value.inlines.some(i => i.type === 'link');
  }

  /* **** Render methods **** */

  function renderLink(props) {
    const { node, attributes, children } = props;
    const { data } = node;

    return (
      <a
        {...attributes}
        href={data.get('url')}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return [
    AddCommands({ wrapLink, unwrapLink }),
    AddQueries({ isLinkActive }),
    RenderInline('link', renderLink),
    PasteLinkify(),
  ];
}

export default Link;
