import React from 'react';
import PropTypes from 'prop-types';

import { BOLD, ITALIC, UNDERLINE } from './utils';

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

  return <span {...attributes}>{node}</span>;
};

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  leaf: PropTypes.object.isRequired,
};

export default Leaf;
