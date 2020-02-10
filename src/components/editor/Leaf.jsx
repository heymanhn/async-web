import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { BOLD, ITALIC, UNDERLINE, CODE_HIGHLIGHT } from './utils';

const CodeHighlight = styled.code(({ theme: { codeFontStack, colors } }) => ({
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

const Leaf = ({ attributes, children, leaf }) => {
  let node = children;
  if (leaf[BOLD]) {
    node = <strong>{node}</strong>;
  }

  if (leaf[ITALIC]) {
    node = <em>{node}</em>;
  }

  if (leaf[UNDERLINE]) {
    node = <u>{node}</u>;
  }

  if (leaf[CODE_HIGHLIGHT]) {
    node = <CodeHighlight>{node}</CodeHighlight>;
  }

  return <span {...attributes}>{node}</span>;
};

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  leaf: PropTypes.object.isRequired,
};

export default Leaf;
