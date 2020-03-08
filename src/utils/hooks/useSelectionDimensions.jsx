/*
 * Returns the x and y coordinates of the top left point of the current editor
 * selection, along with the height and width of the selection range,
 * if expanded.
 *
 * Requires:
 * - the hook to be instantiated in a component that is a child of the <Slate />
 *   provider component
 * - DiscussionContext provided with a reference to the modal component, if
 *   a modal is currently displayed
 */
import { useContext, useEffect, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';

import { DiscussionContext } from 'utils/contexts';

import Editor from 'components/editor/Editor';

const useSelectionDimensions = ({ skip, source = 'selection' } = {}) => {
  const { modalRef } = useContext(DiscussionContext);
  const [data, setData] = useState({});
  const editor = useSlate();

  // Gets the bounding rectangle for either the current selection, or the
  // parent block of the current selection
  const rectForSource = () => {
    switch (source) {
      case 'block': {
        const [block] = Editor.getParentBlock(editor);
        const element = ReactEditor.toDOMNode(editor, block);
        return element.getBoundingClientRect();
      }
      default: {
        const { selection } = editor;
        const range = ReactEditor.toDOMRange(editor, selection);
        return range.getBoundingClientRect();
      }
    }
  };

  const calculateDimensions = () => {
    const { selection } = editor;
    if (!selection || skip) return;

    const rect = rectForSource();
    const { height, width } = rect;

    // When a modal is visible, the window isn't scrolled, only the modal component.
    const { current: modal } = modalRef;
    const yOffset = modal ? modal.scrollTop : window.pageYOffset;
    const xOffset = modal ? modal.scrollLeft : window.pageXOffset;

    const coords = {
      top: rect.top + yOffset,
      left: rect.left + xOffset,
    };

    const dimensions = {
      height,
      width,
    };

    const { coords: oldCoords, dimensions: oldDimensions } = data;
    if (
      oldCoords &&
      oldDimensions &&
      oldCoords.top === coords.top &&
      oldCoords.left === coords.left &&
      oldDimensions.height === dimensions.height &&
      oldDimensions.width === dimensions.width
    )
      return;

    setData({ coords, dimensions, rect });
  };

  useEffect(() => {
    calculateDimensions();

    window.addEventListener('resize', calculateDimensions);
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  });

  return data;
};

export default useSelectionDimensions;
