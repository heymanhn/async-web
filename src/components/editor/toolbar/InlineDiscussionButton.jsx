import React, { useContext } from 'react';
import { Transforms, Range } from 'slate';
import { useSlate } from 'slate-react';

import { getLocalUser } from 'utils/auth';
import { DocumentContext } from 'utils/contexts';
import useDraftMutations from 'utils/hooks/useDraftMutations';
import useKeyDownHandler from 'utils/hooks/useKeyDownHandler';

import Editor from 'components/editor/Editor';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import ToolbarButton from './ToolbarButton';
import ButtonIcon from './ButtonIcon';

const INLINE_DISCUSSION_HOTKEY = 'cmd+opt+m';

const InlineDiscussionButton = props => {
  const editor = useSlate();
  const { handleShowModal } = useContext(DocumentContext);
  const { handleSaveDraft, isSubmitting } = useDraftMutations();
  const { userId } = getLocalUser();

  const handleClick = async () => {
    // Create an empty draft discussion
    const { discussionId } = await handleSaveDraft();

    Editor.wrapInlineAnnotation(editor, null, {
      discussionId,
      authorId: userId,
      isInitialDraft: true, // Toggled to false once first message is created
    });

    Transforms.deselect(editor);
    handleShowModal(discussionId, editor.children);
  };

  const { selection } = editor;
  const isOpen = selection && Range.isExpanded(selection);
  useKeyDownHandler([INLINE_DISCUSSION_HOTKEY, handleClick], !isOpen);

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      {isSubmitting && <LoadingIndicator color="bgGrey" size="16" />}
      {!isSubmitting && <ButtonIcon icon="comment-plus" isActive={false} />}
    </ToolbarButton>
  );
};

export default InlineDiscussionButton;
