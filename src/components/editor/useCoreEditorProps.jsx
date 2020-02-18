import React, { useCallback } from 'react';

import {
  triggerMarkHotkeys,
  triggerBlockHotkeys,
  triggerSoftBreak,
} from './hotkeys';
import Leaf from './Leaf';
import Element from './Element';

const useCoreEditorProps = (editor, { readOnly } = {}) => {
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const renderElement = useCallback(props => <Element {...props} />, []);

  const onKeyDown = event => {
    if (readOnly) return;

    triggerMarkHotkeys(editor, event);
    triggerBlockHotkeys(editor, event);
    triggerSoftBreak(editor, event);
  };

  return {
    onKeyDown,
    renderElement,
    renderLeaf,
  };
};

export default useCoreEditorProps;
