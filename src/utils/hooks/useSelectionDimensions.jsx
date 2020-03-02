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
 *
 * Consumer requirements (TODO):
 * - Needs to return updated dimensions upon window resize or editor change
 *  (e.g. user inserts/removes text or makes a selection)
 */
import { useContext, useState } from 'react';

import useMountEffect from 'utils/hooks/useMountEffect';
import { DiscussionContext } from 'utils/contexts';

const useSelectionDimensions = () => {
  const { modalRef } = useContext(DiscussionContext);
  const [recalculate, setRecalculate] = useState(false);

  useMountEffect(() => {
    const handleResize = () => setRecalculate(true);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // Not using Slate's helpers to get the DOM range because sometimes the
  // DOM node for a Slate node hasn't been created yet at the time of
  // this calculation
  const calculateDimensions = () => {
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const { height, width } = rect;

    // When a modal is visible, the window isn't scrolled, only the modal component.
    const { current: modal } = modalRef;
    const yOffset = modal ? modal.scrollTop : window.pageYOffset;
    const xOffset = modal ? modal.scrollLeft : window.pageXOffset;

    return {
      coords: {
        top: rect.top + yOffset,
        left: rect.left + xOffset,
      },
      dimensions: {
        height,
        width,
      },
    };
  };

  if (recalculate) setRecalculate(false);
  return calculateDimensions();
};

export default useSelectionDimensions;
