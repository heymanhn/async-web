import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { DiscussionContext, MessageContext } from 'utils/contexts';
import useAnnotationMonitor from 'utils/hooks/useAnnotationMonitor';
import useContentState from 'utils/hooks/useContentState';
import useMessageMutations from 'utils/hooks/useMessageMutations';

import useCoreEditorProps from 'components/editor/hooks/useCoreEditorProps';
import Editor from 'components/editor/Editor';
import DefaultPlaceholder from 'components/editor/DefaultPlaceholder';
import DisplayedMessageToolbar from 'components/editor/toolbar/DisplayedMessageToolbar';
import MessageToolbar from 'components/editor/toolbar/MessageToolbar';
import withMarkdownShortcuts from 'components/editor/withMarkdownShortcuts';
import withLinks from 'components/editor/withLinks';
import withInlineDiscussions from 'components/editor/withInlineDiscussions';
import withSectionBreak from 'components/editor/withSectionBreak';
import withPasteShim from 'components/editor/withPasteShim';
import withCustomKeyboardActions from 'components/editor/withCustomKeyboardActions';
import withImages from 'components/editor/withImages';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';

import useMessageDrafts from './hooks/useMessageDrafts';
import MessageActions from './MessageActions';

const Container = styled.div(({ mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: mode === 'compose' ? '160px' : 'initial',
}));

const MessageEditable = styled(Editable)(({ ismodal }) => ({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '26px',
  marginTop: ismodal === 'true' ? '0px' : '15px',
}));

const MessageComposer = ({ initialMessage, autoFocus, ...props }) => {
  const {
    discussionId,
    isModal,
    firstMsgDiscussionId,
    deletedDiscussionId,
    setFirstMsgDiscussionId,
    setDeletedDiscussionId,
  } = useContext(DiscussionContext);
  const { mode } = useContext(MessageContext);
  const readOnly = mode === 'display';

  const baseEditor = useMemo(
    () =>
      compose(
        withCustomKeyboardActions,
        withMarkdownShortcuts,
        withLinks,
        withInlineDiscussions,
        withSectionBreak,
        withPasteShim,
        withHistory,
        withReact
      )(createEditor()),
    []
  );

  /* HN: Slate doesn't allow the editor instance to be re-created on subsequent
   * renders, but we need to pass component-specific data to some HOCs.
   * Workaround is to memoize the base editor instance, and extend it by calling
   * withImages() with the updated variables.
   */
  const messageEditor = useMemo(() => withImages(baseEditor, discussionId), [
    baseEditor,
    discussionId,
  ]);

  const {
    content: message,
    setContent: setMessage,
    ...contentProps
  } = useContentState({
    editor: messageEditor,
    resourceId: discussionId,
    initialContent: initialMessage,
  });

  const { handleCreate, handleUpdate, isSubmitting } = useMessageMutations({
    message,
  });

  const coreEditorProps = useCoreEditorProps(messageEditor, { readOnly });
  useMessageDrafts(message, isSubmitting);
  useAnnotationMonitor(message, setMessage, messageEditor, readOnly);

  // TODO (DISCUSSION V2): This is copy-pasta'ed from DocumentComposer for
  // dealing with updating inline discussions. Can this be DRY'ed up?
  if (firstMsgDiscussionId) {
    Editor.updateInlineAnnotation(messageEditor, firstMsgDiscussionId, {
      isInitialDraft: false,
    });
    setFirstMsgDiscussionId(null);
  }

  // TODO (DISCUSSION V2): This is copy-pasta'ed from DocumentComposer for
  // dealing with updating inline discussions. Can this be DRY'ed up?
  if (deletedDiscussionId) {
    Editor.removeInlineAnnotation(messageEditor, deletedDiscussionId);
    setDeletedDiscussionId(null);
  }

  return (
    <Container mode={mode} {...props}>
      <Slate editor={messageEditor} key={readOnly} {...contentProps}>
        <MessageEditable
          autoFocus={autoFocus}
          ismodal={isModal.toString()}
          readOnly={readOnly}
          {...coreEditorProps}
        />
        {readOnly && <DisplayedMessageToolbar />}
        {!readOnly && <MessageToolbar />}
        <DefaultPlaceholder />
        <CompositionMenuButton />
        {!readOnly && (
          <MessageActions
            handleSubmit={mode === 'compose' ? handleCreate : handleUpdate}
            isSubmitting={isSubmitting}
          />
        )}
      </Slate>
    </Container>
  );
};

MessageComposer.propTypes = {
  initialMessage: PropTypes.string,
  autoFocus: PropTypes.bool,
};

MessageComposer.defaultProps = {
  initialMessage: '',
  autoFocus: false,
};

export default MessageComposer;
