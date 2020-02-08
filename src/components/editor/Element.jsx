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
  SectionBreakElement,
} from './elements';
import ChecklistItemElement from './ChecklistItem';

const Element = props => {
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
    default:
      return <TextElement {...props} />;
  }
};

Element.propTypes = {
  element: PropTypes.object.isRequired,
};

export default Element;