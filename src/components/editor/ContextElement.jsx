/*
 * All the elements except for inline discussion annotations. We don't want to
 * render them in the context UI.
 */
import React from 'react';
import PropTypes from 'prop-types';

import {
  DefaultElement,
  formattingElements,
  listElements,
  wrappedBlockElements,
  voidElements,
  threadContextElements,
} from './elements';

const ContextElement = props => {
  const { element } = props;
  const { type } = element;

  const elements = {
    ...formattingElements,
    ...listElements,
    ...wrappedBlockElements,
    ...voidElements,
    ...threadContextElements,
  };

  const ElementToRender = elements[type] || DefaultElement;
  return <ElementToRender {...props} />;
};

ContextElement.propTypes = {
  element: PropTypes.object.isRequired,
};

export default ContextElement;
