import React from 'react';
import PropTypes from 'prop-types';

const Leaf = ({ attributes, children, leaf }) => {
  let node = null;
  if (leaf.bold) {
    node = <strong>{children}</strong>;
  }

  if (leaf.code) {
    node = <code>{children}</code>;
  }

  if (leaf.italic) {
    node = <em>{children}</em>;
  }

  if (leaf.underline) {
    node = <u>{children}</u>;
  }

  return <span {...attributes}>{node || children}</span>;
};

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  leaf: PropTypes.object.isRequired,
};

export default Leaf;
