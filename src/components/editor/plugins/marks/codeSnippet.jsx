/* eslint react/prop-types: 0 */
import React from 'react';
import styled from '@emotion/styled';

import {
  Hotkey,
  RenderMark,
} from '../helpers';

const CODE_SNIPPET = 'code-snippet';

const StyledCodeSnippet = styled.code(({ theme: { codeFontStack, colors } }) => ({
  background: colors.grey7,
  border: `1px solid ${colors.codeBlockBorderGrey}`,
  borderRadius: '3px',
  color: colors.codeBlockRed,
  fontFamily: `${codeFontStack}`,
  padding: '1px 4px',

  span: {
    fontFamily: `${codeFontStack}`,
  },
}));

function CodeSnippet() {
  function renderCodeSnippet(props) {
    const { attributes, children } = props;

    return <StyledCodeSnippet {...attributes}>{children}</StyledCodeSnippet>;
  }

  return [
    RenderMark(CODE_SNIPPET, renderCodeSnippet),
    Hotkey('mod+k', editor => editor.toggleMark(CODE_SNIPPET)),
  ];
}

export default CodeSnippet;
