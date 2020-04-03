import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Transforms, Range } from 'slate';
import { useSlate } from 'slate-react';

import { DocumentContext } from 'utils/contexts';
import useKeyDownHandler from 'utils/hooks/useKeyDownHandler';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';

const INLINE_DISCUSSION_HOTKEY = 'cmd+opt+m';

const InlineDiscussionButton = ({ content, ...props }) => {
  const editor = useSlate();
  const { handleShowModal } = useContext(DocumentContext);

  const handleClick = () => {
    const { selection } = editor;

    // Keeps the focus on the document for the deselection to occur properly
    setTimeout(() => handleShowModal(null, selection, content), 0);

    Transforms.deselect(editor);
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

InlineDiscussionButton.propTypes = {
  content: PropTypes.array.isRequired,
};

export default InlineDiscussionButton;
