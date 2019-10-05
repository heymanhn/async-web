import { getEventTransfer } from 'slate-react';

import { indicatorNode } from './blocks/dragAndDropIndicator';
/*
 * Should be able to support dragging and dropping of any content in the editor
 *
 * TODO (HN): Support dragging and dropping after a code block, block quote, or other content type
 * where the parent node of the text node is not either a top level paragraph block or a list block
 */
function DragAndDrop() {
  return {
    // Render a visual guide, based on where in the content the user is dragging an element over
    onDragOver(event, editor, next) {
      const { value } = editor;
      const { document } = value;

      let node = editor.findNode(event.target);
      if (node.object !== 'text') return next();

      // HN: I don't have a better way to do this yet, but we want to be selecting the block
      while (node.object === 'text') {
        node = document.getParent(node.key);
      }
      const parent = document.getParent(node.key);
      if (!parent) return next();

      const index = parent.nodes.indexOf(node);
      const indicator = editor.findDragAndDropIndicator();
      const sibling = document.getNextSibling(node.key);

      if (indicator) {
        // Don't re-render the visual guide if it doesn't need to change position
        if (sibling && sibling.key === indicator.key) return next();

        return editor.moveNodeByKey(indicator.key, parent.key, index + 1);
      }

      return editor.insertNodeByKey(parent.key, index + 1, indicatorNode);
    },

    // HN: Custom implementation to handle dragging and dropping of images
    // within the content. Seems weird to have to subclass onDrop() like this,
    // but at least it works.
    onDrop(event, editor, next) {
      const transfer = getEventTransfer(event);
      const { fragment, type } = transfer;
      const { value } = editor;
      const { startBlock } = value;

      if (type === 'fragment') {
        const indicator = editor.findDragAndDropIndicator();
        if (indicator) editor.removeNodeByKey(indicator.key);

        const node = editor.findNode(event.target);
        if (node.key === startBlock.key) return null;

        // TODO: Figure out the `A point should not reference a non-text node!` warnings.
        // Might be related: the cursor gets frozen on the end of the previous block.
        // Low user impact but needs to be fixed soon.
        editor
          .delete()
          .moveTo(node.key)
          .moveToEndOfBlock()
          .insertFragment(fragment)
          .focus();

        return null;
      }

      return next();
    },
  };
}

export default DragAndDrop;
