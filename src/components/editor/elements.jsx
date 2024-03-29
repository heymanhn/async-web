/* eslint react/prop-types: 0 */
import React from 'react';
import styled from '@emotion/styled';

import {
  LARGE_FONT,
  MEDIUM_FONT,
  SMALL_FONT,
  BULLETED_LIST,
  NUMBERED_LIST,
  LIST_ITEM,
  BULLETED_LIST_ITEM,
  NUMBERED_LIST_ITEM,
  CHECKLIST_ITEM,
  LIST_ITEM_INDENT_WIDTH,
  CHECKLIST,
  CODE_BLOCK,
  BLOCK_QUOTE,
  SECTION_BREAK,
  IMAGE,
  HYPERLINK,
  CONTEXT_HIGHLIGHT,
  INLINE_THREAD_ANNOTATION,
  INLINE_TYPES,
} from 'utils/editor/constants';

import InlineThreadElement from 'components/thread/InlineThreadElement';
import ChecklistItemElement from './ChecklistItem';
import ImageElement from './ImageElement';

/*
 * Default element
 */

const DefaultInline = styled.span({});

const DefaultBlock = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 16 }),
  color: colors.contentText,
  marginTop: '12px',
  marginBottom: '20px',
}));

export const DefaultElement = ({ attributes, children, element }) => {
  const Element = INLINE_TYPES.includes(element.type)
    ? DefaultInline
    : DefaultBlock;

  return <Element {...attributes}>{children}</Element>;
};

/*
 * Headings: Large, medium, small
 */
const LargeFont = styled.h1(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 28, weight: 600 }),
  color: colors.mainText,
  margin: '30px 0px -10px',
}));

const MediumFont = styled.h2(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 22, weight: 600 }),
  color: colors.mainText,
  margin: '18px 0px -10px',
}));

const SmallFont = styled.h3(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 16, weight: 600 }),
  color: colors.mainText,
  margin: '12px 0px -10px',
}));

const LargeFontElement = ({ attributes, children }) => (
  <LargeFont {...attributes}>{children}</LargeFont>
);

const MediumFontElement = ({ attributes, children }) => (
  <MediumFont {...attributes}>{children}</MediumFont>
);

const SmallFontElement = ({ attributes, children }) => (
  <SmallFont {...attributes}>{children}</SmallFont>
);

/*
 * List types
 */

const BulletedList = styled.ul(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  marginTop: '12px',
  marginBottom: '20px',
}));

const NumberedList = styled.ul(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  marginTop: '12px',
  marginBottom: '20px',
}));

// Backwards compatibility
const ListItem = styled.li(({ depth, theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  marginBottom: '5px',
  marginLeft: depth ? `${depth * LIST_ITEM_INDENT_WIDTH}px` : 0,
  width: '100%',
}));

const BulletedListItem = styled.li(({ depth = 0, theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  listStyleType: depth % 2 === 0 ? 'disc' : 'circle',
  marginBottom: '5px',
  marginLeft: depth ? `${depth * LIST_ITEM_INDENT_WIDTH}px` : 0,
  width: '100%',
}));

const NumberedListItem = styled.li(({ depth = 0, theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  listStyleType: depth % 2 === 0 ? 'decimal' : 'lower-alpha',
  marginBottom: '5px',
  marginLeft: depth ? `${depth * LIST_ITEM_INDENT_WIDTH}px` : 0,
  width: '100%',
}));

const Checklist = styled.ul(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  marginTop: '12px',
  marginBottom: '20px',
  paddingLeft: '16px',
}));

const BulletedListElement = ({ attributes, children }) => (
  <BulletedList {...attributes}>{children}</BulletedList>
);

const NumberedListElement = ({ attributes, children }) => (
  <NumberedList {...attributes}>{children}</NumberedList>
);

const ChecklistElement = ({ attributes, children }) => (
  <Checklist {...attributes}>{children}</Checklist>
);

const ListItemElement = ({ attributes, children, element }) => (
  <ListItem {...attributes} depth={element.depth}>
    {children}
  </ListItem>
);

const BulletedListItemElement = ({ attributes, children, element }) => (
  <BulletedListItem {...attributes} depth={element.depth}>
    {children}
  </BulletedListItem>
);

const NumberedListItemElement = ({ attributes, children, element }) => (
  <NumberedListItem {...attributes} depth={element.depth}>
    {children}
  </NumberedListItem>
);

/*
 * Code block
 */
const CodeBlock = styled.pre(
  ({ theme: { codeFontStack, colors, fontProps } }) => ({
    background: colors.bgGrey,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    fontFamily: `${codeFontStack}`,
    marginTop: '20px',
    marginBottom: '20px',
    padding: '7px 12px',
    whiteSpace: 'pre-wrap',

    div: {
      ...fontProps({ size: 14 }),
      marginTop: '0 !important',
      marginBottom: '0 !important',
    },

    span: {
      fontFamily: `${codeFontStack}`,
      letterSpacing: '-0.2px',
    },
  })
);

const CodeBlockElement = ({ attributes, children }) => (
  <CodeBlock {...attributes} spellCheck={false}>
    {children}
  </CodeBlock>
);

/*
 * Block quote
 */
const BlockQuote = styled.blockquote(({ theme: { colors } }) => ({
  borderLeft: `3px solid ${colors.borderGrey}`,
  padding: '0px 16px',
  fontStyle: 'italic',

  div: {
    color: colors.grey2,
  },
}));

const BlockQuoteElement = ({ attributes, children }) => (
  <BlockQuote {...attributes}>{children}</BlockQuote>
);

/*
 * Section break
 */

const SectionBreakContainer = styled.div({
  padding: '12px 0 20px',
});

const SectionBreak = styled.div(({ theme: { colors } }) => ({
  borderRadius: '20px',
  borderTop: `2px solid ${colors.borderGrey}`,
  cursor: 'default',
  margin: '0 auto',
  width: '120px',
}));

const SectionBreakElement = ({ attributes, children }) => (
  <SectionBreakContainer {...attributes} contentEditable={false}>
    <SectionBreak />
    {children}
  </SectionBreakContainer>
);

/*
 * Inlines
 */

const StyledLink = styled.a({
  cursor: 'pointer',
});

const LinkElement = ({ attributes, children, element }) => (
  <StyledLink
    {...attributes}
    href={element.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => window.open(element.url, '_blank')}
  >
    {children}
  </StyledLink>
);

/*
 * Inline Discussion elements
 */

const ContextHighlight = styled.span(({ theme: { colors } }) => ({
  background: colors.highlightYellow,
  padding: '2px 0px',
}));

const ContextHighlightElement = ({ attributes, children }) => (
  <ContextHighlight attributes={attributes}>{children}</ContextHighlight>
);

/*
 * Mappings for exports
 */

export const formattingElements = {};
formattingElements[LARGE_FONT] = LargeFontElement;
formattingElements[MEDIUM_FONT] = MediumFontElement;
formattingElements[SMALL_FONT] = SmallFontElement;

export const listElements = {};
listElements[BULLETED_LIST] = BulletedListElement;
listElements[NUMBERED_LIST] = NumberedListElement;
listElements[CHECKLIST] = ChecklistElement;
listElements[LIST_ITEM] = ListItemElement;
listElements[BULLETED_LIST_ITEM] = BulletedListItemElement;
listElements[NUMBERED_LIST_ITEM] = NumberedListItemElement;
listElements[CHECKLIST_ITEM] = ChecklistItemElement;

export const wrappedBlockElements = {};
wrappedBlockElements[CODE_BLOCK] = CodeBlockElement;
wrappedBlockElements[BLOCK_QUOTE] = BlockQuoteElement;

export const voidElements = {};
voidElements[SECTION_BREAK] = SectionBreakElement;
voidElements[IMAGE] = ImageElement;

export const inlineElements = {};
inlineElements[HYPERLINK] = LinkElement;

export const threadContextElements = {};
threadContextElements[CONTEXT_HIGHLIGHT] = ContextHighlightElement;

export const inlineThreadElements = {};
inlineThreadElements[INLINE_THREAD_ANNOTATION] = InlineThreadElement;
