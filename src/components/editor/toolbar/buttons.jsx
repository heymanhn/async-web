import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';

import {
  BOLD,
  ITALIC,
  CODE_BLOCK,
  BLOCK_QUOTE,
  LARGE_FONT,
  MEDIUM_FONT,
  TOOLBAR_SOURCE,
  BULLETED_LIST,
  CHECKLIST,
} from 'utils/editor/constants';

import Editor from 'components/editor/Editor';
import ToolbarButton from './ToolbarButton';
import ButtonIcon from './ButtonIcon';
import HeadingIcon from './HeadingIcon';

/*
 * Buttons for marks: bold, italic, etc.
 */
function MarkButton({ type, icon, ...props }) {
  const editor = useSlate();
  const isActive = Editor.isMarkActive(editor, type);

  function handleClick() {
    Editor.toggleMark(editor, type, TOOLBAR_SOURCE);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={icon} isActive={isActive} />
    </ToolbarButton>
  );
}

MarkButton.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export const BoldButton = () => <MarkButton type={BOLD} icon="bold" />;
export const ItalicButton = () => <MarkButton type={ITALIC} icon="italic" />;

/*
 * Base button for blocks
 */
function BlockButton({ type, icon, CustomIconElement, ...props }) {
  const editor = useSlate();
  const isActive = Editor.isElementActive(editor, type);

  function handleClick() {
    Editor.toggleBlock(editor, type, TOOLBAR_SOURCE);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      {CustomIconElement && <CustomIconElement isActive={isActive} />}
      {!CustomIconElement && <ButtonIcon icon={icon} isActive={isActive} />}
    </ToolbarButton>
  );
}

BlockButton.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  CustomIconElement: PropTypes.func,
};

BlockButton.defaultProps = {
  icon: null,
  CustomIconElement: null,
};

export const CodeBlockButton = () => (
  <BlockButton type={CODE_BLOCK} icon="code" />
);
export const BlockQuoteButton = () => (
  <BlockButton type={BLOCK_QUOTE} icon="quote-right" />
);

/*
 * Buttons for large and medium heading
 */
function HeadingButton({ type, ...props }) {
  const WrappedHeadingIcon = headingProps => (
    <HeadingIcon number={type === LARGE_FONT ? 1 : 2} {...headingProps} />
  );

  return (
    <BlockButton
      type={type}
      CustomIconElement={WrappedHeadingIcon}
      {...props}
    />
  );
}

HeadingButton.propTypes = {
  type: PropTypes.string.isRequired,
};

export const LargeFontButton = () => <HeadingButton type={LARGE_FONT} />;
export const MediumFontButton = () => <HeadingButton type={MEDIUM_FONT} />;

/*
 * Button for bulleted list
 */

export const BulletedListButton = () => (
  <BlockButton type={BULLETED_LIST} icon="list-ul" />
);

/*
 * Button for checklist
 */

export const CheckListButton = () => (
  <BlockButton type={CHECKLIST} icon="check-square" />
);
