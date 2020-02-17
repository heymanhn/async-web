/*
 * All the elements except for inline discussion annotations. We don't want to
 * render them in the context UI.
 *
 * Find a way to DRY this up against <Element /> later
 */
import React from 'react';
import PropTypes from 'prop-types';

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
  SECTION_BREAK,
  HIGHLIGHT,
} from './utils';
import {
  ParagraphElement,
  LargeFontElement,
  MediumFontElement,
  SmallFontElement,
  BulletedListElement,
  NumberedListElement,
  ChecklistElement,
  ListItemElement,
  CodeBlockElement,
  BlockQuoteElement,
  SectionBreakElement,
  HighlightElement,
} from './elements';
import ChecklistItemElement from './ChecklistItem';

const ContextElement = props => {
  const { element } = props;
  const { type } = element;

  switch (type) {
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
    case SECTION_BREAK:
      return <SectionBreakElement {...props} />;
    case HIGHLIGHT:
      return <HighlightElement {...props} />;
    default:
      return <ParagraphElement {...props} />;
  }
};

ContextElement.propTypes = {
  element: PropTypes.object.isRequired,
};

export default ContextElement;
