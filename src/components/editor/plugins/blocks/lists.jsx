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
import ChecklistItem from './ChecklistItem';

const BULLETED_LIST = 'bulleted-list';
const NUMBERED_LIST = 'numbered-list';
const CHECKLIST = 'checklist';
const LIST_ITEM = 'list-item';
const CHECKLIST_ITEM = 'checklist-item';

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

function ListOption({ editor, listType, ...props }) {
  function handleListOption() {
    return editor.clearBlock().setListBlock(listType);
  }

  const icon = <OptionIcon icon={ICONS[listType]} />;

  return (
    <MenuOption
      handleInvoke={handleListOption}
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

const Checklist = styled.ul({
  marginTop: '1em',
  marginBottom: 0,
  paddingLeft: '16px',
});

export function ListsPlugin() {
  /* **** Commands **** */

  function setListBlock(editor, type) {
    const defaultChecklistItem = {
      type: CHECKLIST_ITEM,
      data: { isChecked: false },
    };
    const listItemType = type === CHECKLIST ? defaultChecklistItem : LIST_ITEM;

    // This means the user is looking to un-set the list block
    if (editor.isWrappedBy(type)) {
      return editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock(type);
    }

    // Switching to a different type of list
    if (editor.hasListItems()) {
      return editor
        .unwrapListBlocks()
        .wrapBlock(type);
    }

    // Simplest case: setting the list type as desired
    return editor
      .unwrapAnyBlock()
      .setBlocks(listItemType)
      .wrapBlock(type);
  }

  function unwrapListBlocks(editor) {
    return editor
      .unwrapBlock(BULLETED_LIST)
      .unwrapBlock(NUMBERED_LIST)
      .unwrapBlock(CHECKLIST);
  }

  /* **** Queries **** */

  function hasListItems(editor) {
    return editor.hasBlock(LIST_ITEM) || editor.hasBlock(CHECKLIST_ITEM);
  }

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

  function renderChecklist(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <Checklist {...attributes}>{children}</Checklist>;
  }

  function renderListItem(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <ListItem {...attributes}>{children}</ListItem>;
  }

  function renderChecklistItem(props) {
    return <ChecklistItem {...props} />;
  }

  const renderMethods = [
    RenderBlock(BULLETED_LIST, renderBulletedList),
    RenderBlock(NUMBERED_LIST, renderNumberedList),
    RenderBlock(CHECKLIST, renderChecklist),
    RenderBlock(LIST_ITEM, renderListItem),
    RenderBlock(CHECKLIST_ITEM, renderChecklistItem),
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
    AutoReplace({
      trigger: 'space',
      before: /^(\[\])$/,
      change: change => change.setListBlock(CHECKLIST),
    }),
  ];

  /* **** Hotkeys **** */

  // Pressing Enter while on a blank list item removes the blank list item and exits the list
  function exitListAfterEmptyListItem(editor, next) {
    if (editor.hasListItems() && editor.isEmptyBlock()) {
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
    Hotkey('mod+shift+0', editor => editor.setListBlock(CHECKLIST)),
    CustomEnterAction(exitListAfterEmptyListItem),
    CustomBackspaceAction(resetListItemToParagraph),
    // CustomBackspaceAction(mergeAdjacentLists),
  ];

  return [
    AddCommands({ setListBlock, unwrapListBlocks }),
    AddQueries({ hasListItems, isWrappedByList }),
    renderMethods,
    markdownShortcuts,
    hotkeys,
  ];
}
