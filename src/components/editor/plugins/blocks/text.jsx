import React from 'react';
import PropTypes from 'prop-types';
import { faText } from '@fortawesome/pro-solid-svg-icons';

import { DEFAULT_NODE } from 'components/editor/defaults';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';

/* **** Composition Menu option **** */

function TextOption({ editor, ...props }) {
  function handleClick() {
    return editor.setBlock(DEFAULT_NODE);
  }

  const icon = <OptionIcon icon={faText} />;

  return (
    <MenuOption
      handleClick={handleClick}
      icon={icon}
      title="Text"
      {...props}
    />
  );
}

TextOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default TextOption;
