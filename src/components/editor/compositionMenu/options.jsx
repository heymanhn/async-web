import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';

import {
  DEFAULT_ELEMENT_TYPE,
  LARGE_FONT,
  MEDIUM_FONT,
  BULLETED_LIST,
  NUMBERED_LIST,
  CHECKLIST,
  CODE_BLOCK,
  BLOCK_QUOTE,
  SECTION_BREAK,
  TEXT_OPTION_TITLE,
  LARGE_TITLE_OPTION_TITLE,
  MEDIUM_TITLE_OPTION_TITLE,
  BULLETED_LIST_OPTION_TITLE,
  NUMBERED_LIST_OPTION_TITLE,
  CHECKLIST_OPTION_TITLE,
  CODE_BLOCK_OPTION_TITLE,
  BLOCK_QUOTE_OPTION_TITLE,
  SECTION_BREAK_OPTION_TITLE,
  COMPOSITION_MENU_SOURCE,
} from 'components/editor/utils';
import Editor from '../Editor';
import MenuOption from './MenuOption';
import OptionIcon from './OptionIcon';
import HeadingOptionIcon from './HeadingOptionIcon';

/*
 * Default: Text block
 */
export const TextOption = props => {
  const editor = useSlate();
  const handleTextOption = () =>
    Editor.replaceBlock(editor, DEFAULT_ELEMENT_TYPE, COMPOSITION_MENU_SOURCE);

  return (
    <MenuOption
      handleInvoke={handleTextOption}
      icon={<OptionIcon icon="text" />}
      title={TEXT_OPTION_TITLE}
      {...props}
    />
  );
};

TextOption.propTypes = {
  editor: PropTypes.object.isRequired,
};

/*
 * Large and small headings
 */
const HeadingOption = ({ headingType, ...props }) => {
  const editor = useSlate();
  const handleHeadingOption = () =>
    Editor.replaceBlock(editor, headingType, COMPOSITION_MENU_SOURCE);

  return (
    <MenuOption
      handleInvoke={handleHeadingOption}
      icon={<HeadingOptionIcon number={headingType === LARGE_FONT ? 1 : 2} />}
      title={
        headingType === LARGE_FONT
          ? LARGE_TITLE_OPTION_TITLE
          : MEDIUM_TITLE_OPTION_TITLE
      }
      {...props}
    />
  );
};

HeadingOption.propTypes = {
  headingType: PropTypes.string.isRequired,
};

export const LargeTitleOption = props => (
  <HeadingOption headingType={LARGE_FONT} {...props} />
);

export const MediumTitleOption = props => (
  <HeadingOption headingType={MEDIUM_FONT} {...props} />
);

/*
 * Lists
 */
const LIST_ICONS = {};
LIST_ICONS[BULLETED_LIST] = 'list-ul';
LIST_ICONS[NUMBERED_LIST] = 'list-ol';
LIST_ICONS[CHECKLIST] = 'tasks';

const LIST_OPTION_TITLES = {};
LIST_OPTION_TITLES[BULLETED_LIST] = BULLETED_LIST_OPTION_TITLE;
LIST_OPTION_TITLES[NUMBERED_LIST] = NUMBERED_LIST_OPTION_TITLE;
LIST_OPTION_TITLES[CHECKLIST] = CHECKLIST_OPTION_TITLE;

const ListOption = ({ type, ...props }) => {
  const editor = useSlate();
  const handleListOption = () =>
    Editor.replaceBlock(editor, type, COMPOSITION_MENU_SOURCE);

  return (
    <MenuOption
      handleInvoke={handleListOption}
      icon={<OptionIcon icon={LIST_ICONS[type]} />}
      title={LIST_OPTION_TITLES[type]}
      {...props}
    />
  );
};

ListOption.propTypes = {
  type: PropTypes.oneOf([BULLETED_LIST, NUMBERED_LIST, CHECKLIST]).isRequired,
};

export const BulletedListOption = props => (
  <ListOption type={BULLETED_LIST} {...props} />
);

export const NumberedListOption = props => (
  <ListOption type={NUMBERED_LIST} {...props} />
);

export const ChecklistOption = props => (
  <ListOption type={CHECKLIST} {...props} />
);

/*
 * Code block
 */
export const CodeBlockOption = props => {
  const editor = useSlate();
  const handleCodeBlockOption = () =>
    Editor.replaceBlock(editor, CODE_BLOCK, COMPOSITION_MENU_SOURCE);

  return (
    <MenuOption
      handleInvoke={handleCodeBlockOption}
      icon={<OptionIcon icon="code" />}
      title={CODE_BLOCK_OPTION_TITLE}
      {...props}
    />
  );
};

/*
 * Block quote
 */
export const BlockQuoteOption = props => {
  const editor = useSlate();
  const handleBlockQuoteOption = () =>
    Editor.replaceBlock(editor, BLOCK_QUOTE, COMPOSITION_MENU_SOURCE);

  return (
    <MenuOption
      handleInvoke={handleBlockQuoteOption}
      icon={<OptionIcon icon="quote-right" />}
      title={BLOCK_QUOTE_OPTION_TITLE}
      {...props}
    />
  );
};

/*
 * Section break
 */
export const SectionBreakOption = props => {
  const editor = useSlate();
  const handleSectionBreakOption = () => {
    Editor.clearBlock(editor);
    return Editor.insertVoid(editor, SECTION_BREAK);
  };

  return (
    <MenuOption
      handleInvoke={handleSectionBreakOption}
      icon={<OptionIcon icon="horizontal-rule" />}
      title={SECTION_BREAK_OPTION_TITLE}
      {...props}
    />
  );
};
