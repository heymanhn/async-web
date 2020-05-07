import { useContext } from 'react';

import { ThreadContext } from 'utils/contexts';

// Number of pixels padding from left/right edge of the modal, if needed
const EDGE_PADDING = 20;

/*
 * Used only for the Thread modal
 */
const useModalDimensions = ref => {
  const { modalRef } = useContext(ThreadContext);

  // If in a modal, left or right align as appropriate, as long as the
  // whole element is visible in the modal
  const adjustedLeft = left => {
    const { current: modal } = modalRef || {};
    const { current: element } = ref;

    if (!modal) return left;

    const { offsetWidth: modalWidth } = modal;
    const { offsetWidth: elementWidth } = element;
    const leftEdge = EDGE_PADDING;
    if (left < leftEdge) return leftEdge;

    const rightEdge = modalWidth - EDGE_PADDING;
    const right = left + elementWidth;
    if (right > rightEdge) return rightEdge - elementWidth;

    return left;
  };

  const getModalCoords = ({ top, left }) => ({
    top: `${top}px`,
    left: `${adjustedLeft(left)}px`,
  });

  return { getModalCoords };
};

export default useModalDimensions;
