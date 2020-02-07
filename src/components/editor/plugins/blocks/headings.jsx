import React from 'react';
import PropTypes from 'prop-types';

import {
  DEFAULT_NODE,
  COMPOSITION_MENU_SOURCE,
  HOTKEY_SOURCE,
} from 'components/editor/utils';
import MenuOption from 'components/editor/compositionMenu/MenuOption';
import HeadingOptionIcon from './HeadingOptionIcon';
import { Hotkey, CustomEnterAction } from '../helpers';

const LARGE_FONT = 'heading-one';
const MEDIUM_FONT = 'heading-two';
const SMALL_FONT = 'heading-three';

export const LARGE_TITLE_OPTION_TITLE = 'Large title';
export const SMALL_TITLE_OPTION_TITLE = 'Small title';

/* **** Composition Menu option **** */

function HeadingOption({ editor, headingType, ...props }) {
  function handleHeadingOption() {
    return editor.clearBlock().setBlock(headingType, COMPOSITION_MENU_SOURCE);
  }

  const icon = (
    <HeadingOptionIcon number={headingType === LARGE_FONT ? 1 : 2} />
  );

  return (
    <MenuOption
      handleInvoke={handleHeadingOption}
      icon={icon}
      title={
        headingType === LARGE_FONT
          ? LARGE_TITLE_OPTION_TITLE
          : SMALL_TITLE_OPTION_TITLE
      }
      {...props}
    />
  );
}

HeadingOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

export function LargeTitleOption({ editor, ...props }) {
  return <HeadingOption editor={editor} headingType={LARGE_FONT} {...props} />;
}
export function SmallTitleOption({ editor, ...props }) {
  return <HeadingOption editor={editor} headingType={MEDIUM_FONT} {...props} />;
}

export function HeadingsPlugin() {
  function exitHeadingBlockOnEnter(editor, next) {
    if (
      editor.hasBlock(LARGE_FONT) ||
      editor.hasBlock(MEDIUM_FONT) ||
      editor.hasBlock(SMALL_FONT)
    ) {
      if (editor.isAtBeginning()) return editor.insertBlock(DEFAULT_NODE);

      next();
      return editor.setBlocks(DEFAULT_NODE);
    }

    return next();
  }

  /* **** Hotkeys **** */
  const hotkeys = [
    Hotkey('mod+opt+1', editor => editor.setBlock(LARGE_FONT, HOTKEY_SOURCE)),
    Hotkey('mod+opt+2', editor => editor.setBlock(MEDIUM_FONT, HOTKEY_SOURCE)),
    Hotkey('mod+opt+3', editor => editor.setBlock(SMALL_FONT, HOTKEY_SOURCE)),
    CustomEnterAction(exitHeadingBlockOnEnter),
  ];

  return [hotkeys];
}
