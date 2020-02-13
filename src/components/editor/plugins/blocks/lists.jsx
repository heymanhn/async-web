import { DEFAULT_BLOCK_TYPE } from 'components/editor/utils';
import {
  AddQueries,
  CustomEnterAction,
  CustomBackspaceAction,
} from '../helpers';

const BULLETED_LIST = 'bulleted-list';
const NUMBERED_LIST = 'numbered-list';
const LIST_ITEM = 'list-item';
const CHECKLIST_ITEM = 'checklist-item';

/* **** Slate plugin **** */

export default function ListsPlugin() {
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
      return editor.setBlocks(DEFAULT_BLOCK_TYPE).unwrapListBlocks();
    }

    return next();
  }

  // Consistency with other rich text editors, where pressing backspace on an empty list item
  // resets the selection to a paragraph block
  function resetListItemToParagraph(editor, next) {
    if (editor.hasListItems() && editor.isAtBeginning()) {
      return editor.unwrapListBlocks().setBlocks(DEFAULT_BLOCK_TYPE);
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
