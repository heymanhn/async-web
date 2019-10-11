import React from 'react';
import PropTypes from 'prop-types';
import AutoReplace from 'slate-auto-replace';
import { faListOl, faListUl, faTasks } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import { DEFAULT_NODE } from 'components/editor/defaults';
import {
  AddCommands,
  AddQueries,
  Hotkey,
  RenderBlock,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

const BULLETED_LIST = 'bulleted-list';
const NUMBERED_LIST = 'numbered-list';
const CHECKLIST = 'checklist';
const LIST_ITEM = 'list-item';

const ICONS = {};
ICONS[BULLETED_LIST] = faListUl;
ICONS[NUMBERED_LIST] = faListOl;
ICONS[CHECKLIST] = faTasks;

export const BULLETED_LIST_OPTION_TITLE = 'Bulleted list';
export const NUMBERED_LIST_OPTION_TITLE = 'Numbered list';
export const CHECKLIST_OPTION_TITLE = 'Checklist';

const LIST_OPTION_TITLES = {};
LIST_OPTION_TITLES[BULLETED_LIST] = BULLETED_LIST_OPTION_TITLE;
LIST_OPTION_TITLES[NUMBERED_LIST] = NUMBERED_LIST_OPTION_TITLE;
LIST_OPTION_TITLES[CHECKLIST] = CHECKLIST_OPTION_TITLE;

/* **** Toolbar button **** */

export function BulletedListButton({ editor, ...props }) {
  function handleClick() {
    return editor.setListBlock(BULLETED_LIST);
  }

  // For lists, need to traverse upwards to find whether the list type matches
  function isActive() {
    const { value: { document, blocks } } = editor;

    if (blocks.size > 0) {
      const parent = document.getParent(blocks.first().key);
      return (editor.hasBlock(LIST_ITEM) && parent && parent.type === BULLETED_LIST);
    }

    return false;
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={faListUl} isActive={isActive()} />
    </ToolbarButton>
  );
}

BulletedListButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Composition menu options **** */

export function handleBulletedListOption(editor) {
  return editor.clearBlock().setListBlock(BULLETED_LIST);
}
export function handleNumberedListOption(editor) {
  return editor.clearBlock().setListBlock(NUMBERED_LIST);
}
export function handleChecklistOption(editor) {
  return editor.clearBlock().setListBlock(CHECKLIST);
}

const listOptionHandlers = {};
listOptionHandlers[BULLETED_LIST] = handleBulletedListOption;
listOptionHandlers[NUMBERED_LIST] = handleNumberedListOption;
listOptionHandlers[CHECKLIST] = handleChecklistOption;

function ListOption({ editor, listType, ...props }) {
  const icon = <OptionIcon icon={ICONS[listType]} />;

  return (
    <MenuOption
      handleClick={() => listOptionHandlers[listType](editor)}
      icon={icon}
      title={LIST_OPTION_TITLES[listType]}
      {...props}
    />
  );
}

ListOption.propTypes = {
  editor: PropTypes.object.isRequired,
  listType: PropTypes.oneOf([BULLETED_LIST, NUMBERED_LIST, CHECKLIST]).isRequired,
};

export function BulletedListOption({ editor, ...props }) {
  return <ListOption editor={editor} listType={BULLETED_LIST} {...props} />;
}
export function NumberedListOption({ editor, ...props }) {
  return <ListOption editor={editor} listType={NUMBERED_LIST} {...props} />;
}
export function ChecklistOption({ editor, ...props }) {
  return <ListOption editor={editor} listType={CHECKLIST} {...props} />;
}

/* **** Slate plugin **** */

const BulletedList = styled.ul({
  marginTop: '1em',
  marginBottom: 0,
});

const NumberedList = styled.ol({
  marginTop: '1em',
  marginBottom: 0,
});

const ListItem = styled.li({
  marginBottom: '5px',
  width: '100%',
});

export function ListsPlugin() {
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
      .unwrapAnyBlock()
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
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <BulletedList {...attributes}>{children}</BulletedList>;
  }

  function renderNumberedList(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <NumberedList {...attributes}>{children}</NumberedList>;
  }

  function renderListItem(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
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

  // Pressing Enter while on a blank list item removes the blank list item and exits the list
  function exitListAfterEmptyListItem(editor, next) {
    const { value } = editor;
    const { anchorBlock } = value;

    if (anchorBlock.type === 'list-item' && !anchorBlock.text) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapListBlocks();
    }

    return next();
  }

  // Consistency with other rich text editors, where pressing backspace on an empty list item
  // resets the selection to a paragraph block
  function resetListItemToParagraph(editor, next) {
    if (editor.hasBlock(LIST_ITEM) && editor.isAtBeginning()) {
      return editor
        .unwrapListBlocks()
        .setBlocks(DEFAULT_NODE);
    }

    return next();
  }

  // Only if the two lists that border the empty block are of the same type
  // NOTE: Not that happy with this implementation, seems a bit hacky. Disabling this functionality
  // for now and adding a follow-up task to implement
  // function mergeAdjacentLists(editor, next) {
  //   if (editor.isAtBeginning()) {
  //     next();

  //     if (!editor.hasBlock(LIST_ITEM)) return null;

  //     // Assuming that if a block has list items, it has to be wrapped by a type of list
  //     const currentType = editor.getParentBlock().type;
  //     const { offset } = editor.value.selection.anchor;
  //     editor
  //       .moveToEndOfBlock()
  //       .moveForward(1);

  //     if (!editor.hasBlock(LIST_ITEM) || editor.getParentBlock().type !== currentType) {
  //       return editor
  //         .moveBackward(1)
  //         .moveTo(offset);
  //     }
  //
  //     return editor
  //       .unwrapListBlocks()
  //       .deleteBackward(1)
  //       .insertBlock(LIST_ITEM)
  //       .deleteForward(1)
  //       .moveBackward(1)
  //       .moveTo(offset);
  //   }

  //   return next();
  // }

  const hotkeys = [
    Hotkey('mod+shift+7', editor => editor.setListBlock(NUMBERED_LIST)),
    Hotkey('mod+shift+8', editor => editor.setListBlock(BULLETED_LIST)),
    CustomEnterAction(exitListAfterEmptyListItem),
    CustomBackspaceAction(resetListItemToParagraph),
    // CustomBackspaceAction(mergeAdjacentLists),
  ];

  return [
    AddCommands({ setListBlock, unwrapListBlocks }),
    AddQueries({ isWrappedByList }),
    renderMethods,
    markdownShortcuts,
    hotkeys,
  ];
}
