/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';

import { DEFAULT_NODE, AddCommands, AddQueries, RenderBlock } from '../helpers';

function Lists() {
  /* **** Commands **** */

  function setListBlock(editor, type) {
    const hasListItems = editor.hasBlock('list-item');

    // This means the user is looking to un-set the list block
    if (editor.isWrappedBy(type)) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock(type);
    }

    // Converting a bulleted list to a numbered list, or vice versa
    if (hasListItems) {
      return editor
        .unwrapListBlocks()
        .wrapBlock(type);
    }

    // Simplest case: setting the list type as desired
    return editor
      .unwrapNonListBlocks()
      .setBlocks('list-item')
      .wrapBlock(type);
  }

  function unwrapListBlocks(editor) {
    return editor
      .unwrapBlock('bulleted-list')
      .unwrapBlock('numbered-list');
  }

  /* **** Queries **** */

  function isWrappedByList(editor) {
    return editor.isWrappedBy('bulleted-list') || editor.isWrappedBy('numbered-list');
  }

  /* **** Render methods **** */

  function renderBulletedList(props) {
    const { attributes, children } = props;
    return <ul {...attributes}>{children}</ul>;
  }

  function renderNumberedList(props) {
    const { attributes, children } = props;
    return <ol {...attributes}>{children}</ol>;
  }

  function renderListItem(props) {
    const { attributes, children } = props;
    return <li {...attributes}>{children}</li>;
  }

  const renderMethods = [
    RenderBlock('bulleted-list', renderBulletedList),
    RenderBlock('numbered-list', renderNumberedList),
    RenderBlock('list-item', renderListItem),
  ];

  /* **** Markdown **** */

  const markdownShortcuts = [
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      change: change => change.setListBlock('bulleted-list'),
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(1.)$/,
      change: change => change.setListBlock('numbered-list'),
    }),
  ];

  return [
    AddCommands({ setListBlock, unwrapListBlocks }),
    AddQueries({ isWrappedByList }),
    renderMethods,
    markdownShortcuts,
  ];
}

export default Lists;
