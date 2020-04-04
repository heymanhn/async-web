/* eslint react/prop-types: 0 */
import React from 'react';
import styled from '@emotion/styled';

import InlineDiscussionElement from 'components/discussion/InlineDiscussionElement';
import ImageElement from './ImageElement';

import ChecklistItemElement from './ChecklistItem';
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
  IMAGE,
  HYPERLINK,
  CONTEXT_HIGHLIGHT,
  INLINE_DISCUSSION_ANNOTATION,
  INLINE_TYPES,
} from './utils';

/*
 * Default element
 */

const DefaultInline = styled.span({});

const DefaultBlock = styled.div(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '16px',
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
const LargeFont = styled.h1(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '28px',
  fontWeight: 600,
  lineHeight: '36px',
  letterSpacing: '-0.02em',
  margin: '30px 0px -10px',
}));

const MediumFont = styled.h2(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: '28px',
  letterSpacing: '-0.018em',
  margin: '18px 0px -10px',
}));

const SmallFont = styled.h3(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '22px',
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

const BulletedList = styled.ul({
  fontSize: '16px',
  marginTop: '12px',
  marginBottom: '20px',
});

const NumberedList = styled.ol({
  fontSize: '16px',
  marginTop: '12px',
  marginBottom: '20px',
});

const ListItem = styled.li({
  fontSize: '16px',
  marginBottom: '5px',
  width: '100%',
});

const Checklist = styled.ul({
  fontSize: '16px',
  marginTop: '12px',
  marginBottom: '20px',
  paddingLeft: '16px',
});

const BulletedListElement = ({ attributes, children }) => (
  <BulletedList {...attributes}>{children}</BulletedList>
);

const NumberedListElement = ({ attributes, children }) => (
  <NumberedList {...attributes}>{children}</NumberedList>
);

const ChecklistElement = ({ attributes, children }) => (
  <Checklist {...attributes}>{children}</Checklist>
);

const ListItemElement = ({ attributes, children }) => (
  <ListItem {...attributes}>{children}</ListItem>
);

/*
 * Code block
 */
const CodeBlock = styled.pre(({ theme: { codeFontStack, colors } }) => ({
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  fontFamily: `${codeFontStack}`,
  marginTop: '20px',
  marginBottom: '20px',
  padding: '7px 12px',
  whiteSpace: 'pre-wrap',

  div: {
    fontSize: '14px',
    marginTop: '0 !important',
    marginBottom: '0 !important',
  },

  span: {
    fontFamily: `${codeFontStack}`,
    letterSpacing: '-0.2px',
  },
}));

const CodeBlockElement = ({ attributes, children }) => (
  <CodeBlock {...attributes}>{children}</CodeBlock>
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

const SectionBreak = styled.div(({ theme: { colors } }) => ({
  borderRadius: '20px',
  borderTop: `2px solid ${colors.borderGrey}`,
  margin: '2em auto',
  width: '120px',
}));

const SectionBreakElement = ({ attributes, children }) => (
  <div {...attributes}>
    <SectionBreak />
    {children}
  </div>
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
listElements[CHECKLIST_ITEM] = ChecklistItemElement;

export const wrappedBlockElements = {};
wrappedBlockElements[CODE_BLOCK] = CodeBlockElement;
wrappedBlockElements[BLOCK_QUOTE] = BlockQuoteElement;

export const voidElements = {};
voidElements[SECTION_BREAK] = SectionBreakElement;
voidElements[IMAGE] = ImageElement;

export const inlineElements = {};
inlineElements[HYPERLINK] = LinkElement;

export const discussionContextElements = {};
discussionContextElements[CONTEXT_HIGHLIGHT] = ContextHighlightElement;

export const inlineDiscussionElements = {};
inlineDiscussionElements[
  INLINE_DISCUSSION_ANNOTATION
] = InlineDiscussionElement;
