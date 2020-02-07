import React from 'react';
import PropTypes from 'prop-types';
import { faListOl, faListUl, faTasks } from '@fortawesome/free-solid-svg-icons';

import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import { DEFAULT_NODE, COMPOSITION_MENU_SOURCE } from 'components/editor/utils';
import {
  AddQueries,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

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

/* **** Composition menu options **** */

function ListOption({ editor, listType, ...props }) {
  function handleListOption() {
    return editor.clearBlock().setListBlock(listType, COMPOSITION_MENU_SOURCE);
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
  listType: PropTypes.oneOf([BULLETED_LIST, NUMBERED_LIST, CHECKLIST])
    .isRequired,
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

export function ListsPlugin() {
  /* **** Queries **** */

  function hasListItems(editor) {
    return editor.hasBlock(LIST_ITEM) || editor.hasBlock(CHECKLIST_ITEM);
  }

  function isWrappedByList(editor) {
    return (
      editor.isWrappedBy(BULLETED_LIST) || editor.isWrappedBy(NUMBERED_LIST)
    );
  }

  /* **** Hotkeys **** */

  // Pressing Enter while on a blank list item removes the blank list item and exits the list
  function exitListAfterEmptyListItem(editor, next) {
    if (editor.hasListItems() && editor.isEmptyBlock()) {
      return editor.setBlocks(DEFAULT_NODE).unwrapListBlocks();
    }

    return next();
  }

  // Consistency with other rich text editors, where pressing backspace on an empty list item
  // resets the selection to a paragraph block
  function resetListItemToParagraph(editor, next) {
    if (editor.hasListItems() && editor.isAtBeginning()) {
      return editor.unwrapListBlocks().setBlocks(DEFAULT_NODE);
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
    CustomEnterAction(exitListAfterEmptyListItem),
    CustomBackspaceAction(resetListItemToParagraph),
    // CustomBackspaceAction(mergeAdjacentLists),
  ];

  return [AddQueries({ hasListItems, isWrappedByList }), hotkeys];
}
