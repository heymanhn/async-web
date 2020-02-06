import React, { useCallback } from 'react';
import { isHotkey } from 'is-hotkey';

import {
  BOLD,
  ITALIC,
  UNDERLINE,
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
  BULLETED_LIST,
  NUMBERED_LIST,
  LIST_ITEM,
  CHECKLIST_ITEM,
  CHECKLIST,
  CODE_BLOCK,
  BLOCK_QUOTE,
} from './utils';
import {
  TextElement,
  LargeFontElement,
  MediumFontElement,
  SmallFontElement,
  BulletedListElement,
  NumberedListElement,
  ChecklistElement,
  ListItemElement,
  CodeBlockElement,
  BlockQuoteElement,
} from './elements';
import ChecklistItemElement from './ChecklistItem';
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
      case LARGE_FONT:
        return <LargeFontElement {...props} />;
      case MEDIUM_FONT:
        return <MediumFontElement {...props} />;
      case SMALL_FONT:
        return <SmallFontElement {...props} />;
      case BULLETED_LIST:
        return <BulletedListElement {...props} />;
      case NUMBERED_LIST:
        return <NumberedListElement {...props} />;
      case LIST_ITEM:
        return <ListItemElement {...props} />;
      case CHECKLIST:
        return <ChecklistElement {...props} />;
      case CHECKLIST_ITEM:
        return <ChecklistItemElement {...props} />;
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
