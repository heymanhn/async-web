import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Transforms, Range } from 'slate';
import { useSlate } from 'slate-react';

import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import { DiscussionContext, ThreadContext } from 'utils/contexts';

import Editor from 'components/editor/Editor';
import ToolbarButton from './ToolbarButton';
import ButtonIcon from './ButtonIcon';

const QUOTE_REPLY_HOTKEY = 'cmd+opt+r';

const QuoteReplyButton = ({ source, ...props }) => {
  const editor = useSlate();
  const { setQuoteReply } = useContext(
    source === 'discussion' ? DiscussionContext : ThreadContext
  );

  const handleClick = async () => {
    Editor.makeDOMSelection(editor);

    const text = Editor.string(editor, editor.selection);
    Transforms.deselect(editor);
    setQuoteReply(text);
  };

  const { selection } = editor;
  const isOpen = selection && Range.isExpanded(selection);
  useKeyDownHandler([QUOTE_REPLY_HOTKEY, handleClick], !isOpen);

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon="reply" isActive={false} />
    </ToolbarButton>
  );
};

QuoteReplyButton.propTypes = {
  source: PropTypes.oneOf(['discussion', 'thread']).isRequired,
};

export default QuoteReplyButton;
