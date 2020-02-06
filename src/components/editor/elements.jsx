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

export const TextElement = ({ attributes, children }) => {
  return <TextBlock {...attributes}>{children}</TextBlock>;
};

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

export const CodeBlockElement = ({ attributes, children }) => {
  return <CodeBlock {...attributes}>{children}</CodeBlock>;
};

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

export const BlockQuoteElement = ({ attributes, children }) => {
  return <BlockQuote {...attributes}>{children}</BlockQuote>;
};
