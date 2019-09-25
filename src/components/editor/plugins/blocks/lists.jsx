/* eslint react/prop-types: 0 */
import React from 'react';
import AutoReplace from 'slate-auto-replace';
import styled from '@emotion/styled';

import {
  DEFAULT_NODE,
  AddCommands,
  AddQueries,
  Hotkey,
  RenderBlock,
} from '../helpers';

const BULLETED_LIST = 'bulleted-list';
const NUMBERED_LIST = 'numbered-list';
const LIST_ITEM = 'list-item';

const BulletedList = styled.ul({
  marginTop: '1em',
  marginBottom: 0,
});

const NumberedList = styled.ol({
  marginTop: '1em',
  marginBottom: 0,
});

const ListItem = styled.li({
  marginTop: '3px',
});

function Lists() {
  /* **** Commands **** */

  function setListBlock(editor, type) {
    const hasListItems = editor.hasBlock(LIST_ITEM);

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
      .setBlocks(LIST_ITEM)
      .wrapBlock(type);
  }

  function unwrapListBlocks(editor) {
    return editor
      .unwrapBlock(BULLETED_LIST)
      .unwrapBlock(NUMBERED_LIST);
  }

  /* **** Queries **** */

  function isWrappedByList(editor) {
    return editor.isWrappedBy(BULLETED_LIST) || editor.isWrappedBy(NUMBERED_LIST);
  }

  /* **** Render methods **** */

  function renderBulletedList(props) {
    const { attributes, children } = props;
    return <BulletedList {...attributes}>{children}</BulletedList>;
  }

  function renderNumberedList(props) {
    const { attributes, children } = props;
    return <NumberedList {...attributes}>{children}</NumberedList>;
  }

  function renderListItem(props) {
    const { attributes, children } = props;
    return <ListItem {...attributes}>{children}</ListItem>;
  }

  const renderMethods = [
    RenderBlock(BULLETED_LIST, renderBulletedList),
    RenderBlock(NUMBERED_LIST, renderNumberedList),
    RenderBlock(LIST_ITEM, renderListItem),
  ];

  /* **** Markdown **** */

  const markdownShortcuts = [
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      change: change => change.setListBlock(BULLETED_LIST),
    }),
    AutoReplace({
      trigger: 'space',
      before: /^(1.)$/,
      change: change => change.setListBlock(NUMBERED_LIST),
    }),
  ];

  /* **** Hotkeys **** */
  const hotkeys = [
    Hotkey('mod+shift+7', editor => editor.setListBlock(NUMBERED_LIST)),
    Hotkey('mod+shift+8', editor => editor.setListBlock(BULLETED_LIST)),
  ];

  return [
    AddCommands({ setListBlock, unwrapListBlocks }),
    AddQueries({ isWrappedByList }),
    renderMethods,
    markdownShortcuts,
    hotkeys,
  ];
}

export default Lists;
