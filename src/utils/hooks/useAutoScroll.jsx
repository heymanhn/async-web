import { useEffect } from 'react';


/*
 * Automatically scroll down on the current window if the cursor is active on some
 * content and the cursor is too close to the bottom of the window.
 */
const useAutoScroll = () => {
  useEffect(() => {
    const native = window.getSelection();

    if (!native.isCollapsed) {
      const range = native.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // const newCoords = {
      //   top: `${rect.top + window.pageYOffset - 3}px`, // Vertically aligning the placeholder
      //   left: `${rect.left + window.pageXOffset + 2}px`, // Some breathing room after the cursor
      // };

      // if (coords && newCoords.top === coords.top && newCoords.left === coords.left) return;

      // if (!isVisible) {
      //   newCoords.top = -10000;
      //   newCoords.left = -10000;
      // }

      // setCoords(newCoords);
    }
  });
};

export default useAutoScroll;
