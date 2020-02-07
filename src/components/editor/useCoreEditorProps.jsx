import React, { useCallback } from 'react';

import { triggerMarkHotkeys, triggerBlockHotkeys } from './hotkeys';
import Leaf from './Leaf';
import Element from './Element';

const useCoreEditorProps = editor => {
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const renderElement = useCallback(props => <Element {...props} />, []);

  function onKeyDown(event) {
    triggerMarkHotkeys(editor, event);
    triggerBlockHotkeys(editor, event);
  }

  return {
    onKeyDown,
    renderElement,
    renderLeaf,
  };
};

export default useCoreEditorProps;
