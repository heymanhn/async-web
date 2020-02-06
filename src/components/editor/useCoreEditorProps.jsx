import React, { useCallback } from 'react';
import { isHotkey } from 'is-hotkey';

import { BOLD, ITALIC, UNDERLINE, CODE_BLOCK, BLOCK_QUOTE } from './utils';
import { TextElement, CodeBlockElement, BlockQuoteElement } from './elements';
import Editor from './Editor';
import Leaf from './Leaf';

const MARK_HOTKEYS = {
  'mod+b': BOLD,
  'mod+i': ITALIC,
  'mod+u': UNDERLINE,
};

const useCoreEditorProps = editor => {
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case CODE_BLOCK:
        return <CodeBlockElement {...props} />;
      case BLOCK_QUOTE:
        return <BlockQuoteElement {...props} />;
      default:
        return <TextElement {...props} />;
    }
  }, []);

  function onKeyDown(event) {
    Object.keys(MARK_HOTKEYS).forEach(hotkey => {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = MARK_HOTKEYS[hotkey];
        Editor.toggleMark(editor, mark);
      }
    });
  }

  return {
    onKeyDown,
    renderElement,
    renderLeaf,
  };
};

export default useCoreEditorProps;
