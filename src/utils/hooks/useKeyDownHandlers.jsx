/*
 * For handling key press events on non-input elements
 *
 * Supports any number of [key => callback function] tuples
 */
import { useEffect } from 'react';
import isHotkey from 'is-hotkey';

const useKeyDownHandlers = (handlers, isDisabled) => {
  useEffect(() => {
    if (isDisabled) return null;

    const handleKeyDown = event => {
      handlers.forEach(([key, callback]) => {
        if (isHotkey(key, event)) {
          event.preventDefault();
          callback(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
};

export default useKeyDownHandlers;
