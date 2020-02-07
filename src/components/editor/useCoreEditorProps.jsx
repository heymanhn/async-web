import React, { useCallback } from 'react';

import {
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
import { triggerMarkHotkeys, triggerBlockHotkeys } from './hotkeys';
import ChecklistItemElement from './ChecklistItem';
import Leaf from './Leaf';

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
