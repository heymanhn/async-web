import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { faText } from '@fortawesome/pro-solid-svg-icons';

import { DEFAULT_NODE } from 'components/editor/utils';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import OptionIcon from 'components/editor/compositionMenu/OptionIcon';
import { RenderBlock } from '../helpers';

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

/* Slate Plugin */
const TextBlock = styled.div(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '16px',
  marginTop: '12px',
  marginBottom: '20px',
}));

export function TextBlockPlugin() {
  function renderTextBlock(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    return <TextBlock {...attributes}>{children}</TextBlock>;
  }

  return RenderBlock(DEFAULT_NODE, renderTextBlock);
}
