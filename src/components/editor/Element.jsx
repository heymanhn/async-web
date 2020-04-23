import React from 'react';
import PropTypes from 'prop-types';

import {
  DefaultElement,
  formattingElements,
  listElements,
  wrappedBlockElements,
  voidElements,
  inlineElements,
  inlineThreadElements,
} from './elements';

const Element = props => {
  const { element } = props;
  const { type } = element;

  const elements = {
    ...formattingElements,
    ...listElements,
    ...wrappedBlockElements,
    ...voidElements,
    ...inlineElements,
    ...inlineThreadElements,
  };

  const ElementToRender = elements[type] || DefaultElement;
  return <ElementToRender {...props} />;
};

Element.propTypes = {
  element: PropTypes.object.isRequired,
};

export default Element;
