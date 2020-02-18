/*
 * NOTE (HN): Not using this anymore since it seems Slate has some built-in
 * capabilities to auto-scroll to where the cursor is. But keeping this
 * implementation around in case we need it later.
 */
import { useEffect } from 'react';
import { ReactEditor } from 'slate-react';

const MINIMUM_DISTANCE_FROM_BOTTOM = 60;

const useAutoScrollWindow = editor => {
  const updateWindowPosition = () => {
    const { selection } = editor;
    if (!selection) return; // Means the editor is blurred

    const range = ReactEditor.toDOMRange(editor, selection);
    const rect = range.getBoundingClientRect();

    const distanceFromBottom = window.innerHeight - rect.bottom;

    if (distanceFromBottom < MINIMUM_DISTANCE_FROM_BOTTOM) {
      const scrollDistance = MINIMUM_DISTANCE_FROM_BOTTOM - distanceFromBottom;
      window.scroll({ top: window.scrollY + scrollDistance });
    }
  };

  useEffect(updateWindowPosition, [editor]);
};

export default useAutoScrollWindow;
