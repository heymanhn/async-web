import React, { useCallback } from 'react';

import {
  markHotkeys,
  blockHotkeys,
  softBreak,
  exitCodeHighlight,
  nestedListHotkeys,
} from '../hotkeys';
import Leaf from '../Leaf';
import Element from '../Element';

const useCoreEditorProps = (editor, { readOnly } = {}) => {
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const renderElement = useCallback(props => <Element {...props} />, []);

  const onKeyDown = event => {
    if (readOnly) return;

    markHotkeys(editor, event);
    blockHotkeys(editor, event);
    softBreak(editor, event);
    exitCodeHighlight(editor, event);
    nestedListHotkeys(editor, event);
  };

  return {
    onKeyDown,
    renderElement,
    renderLeaf,
  };
};

export default useCoreEditorProps;
