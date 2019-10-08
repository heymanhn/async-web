import React from 'react';
import PropTypes from 'prop-types';
import { faText } from '@fortawesome/pro-solid-svg-icons';

import { DEFAULT_NODE } from 'components/editor/defaults';
import MenuOption from 'components/editor/compositionMenu/MenuOption';

/* **** Composition Menu option **** */

function TextOption({ editor, ...props }) {
  function handleClick() {
    return editor.setBlock(DEFAULT_NODE);
  }

  return (
    <MenuOption
      handleClick={handleClick}
      icon={faText}
      title="Text"
      {...props}
    />
  );
}

TextOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default TextOption;
