import React from 'react';
import PropTypes from 'prop-types';
import { Transforms, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import useMessageDraftMutations from 'hooks/message/useMessageDraftMutations';
import { getLocalUser } from 'utils/auth';

import Editor from 'components/editor/Editor';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import ToolbarButton from './ToolbarButton';
import ButtonIcon from './ButtonIcon';

const INLINE_DISCUSSION_HOTKEY = 'cmd+opt+m';

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '5px 10px',
});

const StartInlineThreadButton = ({ handleShowThread, ...props }) => {
  const editor = useSlate();
  const { handleSaveMessageDraft, isSubmitting } = useMessageDraftMutations();
  const { userId } = getLocalUser();

  const makeDOMSelection = () => {
    const domSelection = window.getSelection();
    const domRange =
      domSelection && domSelection.rangeCount > 0 && domSelection.getRangeAt(0);

    if (!domRange) return;
    const range = ReactEditor.toSlateRange(editor, domRange);
    Transforms.select(editor, range);
  };

  const handleClick = async () => {
    // Create an empty draft discussion
    const { discussionId: threadId } = await handleSaveMessageDraft({
      isThread: true,
    });

    // Special case for starting inline discussion from read-only message content
    // TODO (DISCUSSION V2): Do this another way, instead of special casing like this.
    let mode = 'document';
    if (!editor.selection) {
      mode = 'discussion';
      makeDOMSelection();
    }

    Editor.createInlineAnnotation(editor, {
      discussionId: threadId, // backwards compatibility
      authorId: userId,
      isInitialDraft: true, // Toggled to false once first message is created
      mode,
    });

    // Remove all the top-level nodes outside of the current selection
    // before handing it into the modal as the content to generate context for
    const { children, selection } = editor;
    const [start, end] = Range.edges(selection);
    const endRange = end.path[0] + 1;
    const newContents = JSON.parse(JSON.stringify(children)).slice(
      start.path[0],
      endRange
    );

    Transforms.deselect(editor);
    handleShowThread({
      threadId,
      initialTopic: newContents,
      sourceEditor: editor,
    });
  };

  const { selection } = editor;
  const isOpen = selection && Range.isExpanded(selection);
  useKeyDownHandler([INLINE_DISCUSSION_HOTKEY, handleClick], !isOpen);

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      {isSubmitting && <StyledLoadingIndicator color="bgGrey" size="16" />}
      {!isSubmitting && <ButtonIcon icon="comment-plus" isActive={false} />}
    </ToolbarButton>
  );
};

StartInlineThreadButton.propTypes = {
  handleShowThread: PropTypes.func.isRequired,
};

export default StartInlineThreadButton;
