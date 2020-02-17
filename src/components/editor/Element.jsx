import React from 'react';
import PropTypes from 'prop-types';

import {
  ParagraphElement,
  formattingElements,
  listElements,
  wrappedBlockElements,
  voidElements,
  inlineDiscussionElements,
} from './elements';

const Element = props => {
  const { element } = props;
  const { type } = element;

  const elements = {
    ...formattingElements,
    ...listElements,
    ...wrappedBlockElements,
    ...voidElements,
    ...inlineDiscussionElements,
  };

  const ElementToRender = elements[type] || ParagraphElement;
  return <ElementToRender {...props} />;
};

Element.propTypes = {
  element: PropTypes.object.isRequired,
};

export default Element;
