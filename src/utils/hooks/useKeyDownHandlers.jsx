/*
 * For handling key press events on non-input elements
 *
 * Supports any number of [key => callback function] tuples. Also supports
 * passing one tuple as an array, into the first argument
 */
import { useEffect } from 'react';
import isHotkey from 'is-hotkey';

// Obviously with TypeScript this would be even neater
const isHandler = entry => {
  if (entry.length !== 2) return false;

  const [key, callback] = entry;
  return typeof key === 'string' && typeof callback === 'function';
};

const useKeyDownHandlers = (handlers, isDisabled) => {
  useEffect(() => {
    if (isDisabled) return null;

    const handleKeyDown = event => {
      const mappings = isHandler(handlers) ? [handlers] : handlers;

      mappings.forEach(([key, callback]) => {
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
