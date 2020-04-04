import React, { useContext } from 'react';
import { Transforms, Range } from 'slate';
import { useSlate } from 'slate-react';

import { DocumentContext } from 'utils/contexts';
import useKeyDownHandler from 'utils/hooks/useKeyDownHandler';

import Editor from 'components/editor/Editor';
import ToolbarButton from './ToolbarButton';
import ButtonIcon from './ButtonIcon';

const INLINE_DISCUSSION_HOTKEY = 'cmd+opt+m';

const InlineDiscussionButton = props => {
  const editor = useSlate();
  const { handleShowModal } = useContext(DocumentContext);

  const handleClick = () => {
    const id = Date.now();

    Editor.wrapContextHighlight(editor, { id });
    Transforms.deselect(editor);
    handleShowModal(null, id, editor.children);
  };

  const { selection } = editor;
  const isOpen = selection && Range.isExpanded(selection);
  useKeyDownHandler([INLINE_DISCUSSION_HOTKEY, handleClick], !isOpen);

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon="comment-plus" isActive={false} />
    </ToolbarButton>
  );
};

export default InlineDiscussionButton;
