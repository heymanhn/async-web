import { getEventTransfer, findNode } from 'slate-react';

/*
 * Should be able to support dragging and dropping of any content in the editor
 */
function DragAndDrop() {
  return {
    // onDragStart(event, editor, next) {
    //   return next();
    // },

    // HN: Custom implementation to handle dragging and dropping of images
    // within the content. Seems weird to have to subclass onDrop() like this,
    // but at least it works.
    onDrop(event, editor, next) {
      const transfer = getEventTransfer(event);
      const { fragment, type } = transfer;
      const { value } = editor;
      const { startBlock } = value;

      if (type === 'fragment') {
        const node = findNode(event.target, editor);
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
