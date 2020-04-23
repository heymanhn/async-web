import React, { useCallback } from 'react';

import {
  markHotkeys,
  blockHotkeys,
  softBreak,
  exitCodeHighlight,
  nestedListHotkeys,
} from 'utils/editor/hotkeys';

import Leaf from 'components/editor/Leaf';
import Element from 'components/editor/Element';

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
