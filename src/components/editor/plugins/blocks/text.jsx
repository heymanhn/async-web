import React from 'react';
import PropTypes from 'prop-types';
import { faText } from '@fortawesome/pro-solid-svg-icons';

import { DEFAULT_NODE } from 'components/editor/defaults';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';

export const TEXT_OPTION_TITLE = 'Text';

/* **** Composition Menu option **** */

export function TextOption({ editor, ...props }) {
  function handleTextOption() {
    return editor.clearBlock().setBlock(DEFAULT_NODE);
  }

  const icon = <OptionIcon icon={faText} />;

  return (
    <MenuOption
      handleInvoke={handleTextOption}
      icon={icon}
      title={TEXT_OPTION_TITLE}
      {...props}
    />
  );
}

TextOption.propTypes = {
  editor: PropTypes.object.isRequired,
};
