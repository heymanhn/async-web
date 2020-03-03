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
import { useContext, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';

import useMountEffect from 'utils/hooks/useMountEffect';
import { DiscussionContext } from 'utils/contexts';

const useSelectionDimensions = skip => {
  const { modalRef } = useContext(DiscussionContext);
  const [data, setData] = useState({});
  const editor = useSlate();

  const calculateDimensions = () => {
    const { selection } = editor;
    if (!selection || skip) return;

    const range = ReactEditor.toDOMRange(editor, selection);
    const rect = range.getBoundingClientRect();
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

    setData({ coords, dimensions });
  };

  useMountEffect(() => {
    window.addEventListener('resize', calculateDimensions);
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  });

  // Needed so that the DOM has a chance to:
  // 1. Render any new nodes and ranges for text insertions
  // 2. Update the selection range so that getBoundingClientRect() is correct
  setTimeout(calculateDimensions, 0);

  return data;
};

export default useSelectionDimensions;
