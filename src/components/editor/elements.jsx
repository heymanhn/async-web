/* eslint react/prop-types: 0 */
import React from 'react';
import styled from '@emotion/styled';

/*
 * Default element, which is a paragraph block with better styling
 */
const TextBlock = styled.div(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '16px',
  marginTop: '12px',
  marginBottom: '20px',
}));

export const TextElement = ({ attributes, children }) => (
  <TextBlock {...attributes}>{children}</TextBlock>
);

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
  letterSpacing: '-0.011em',
  margin: '12px 0px -10px',
}));

export const LargeFontElement = ({ attributes, children }) => (
  <LargeFont {...attributes}>{children}</LargeFont>
);

export const MediumFontElement = ({ attributes, children }) => (
  <MediumFont {...attributes}>{children}</MediumFont>
);

export const SmallFontElement = ({ attributes, children }) => (
  <SmallFont {...attributes}>{children}</SmallFont>
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

export const CodeBlockElement = ({ attributes, children }) => (
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

export const BlockQuoteElement = ({ attributes, children }) => (
  <BlockQuote {...attributes}>{children}</BlockQuote>
);
