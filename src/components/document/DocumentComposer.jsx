import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import { DocumentContext } from 'utils/contexts';
import useContentState from 'utils/hooks/useContentState';
import useAutoSave from 'utils/hooks/useAutoSave';
import useDocumentMutations from 'utils/hooks/useDocumentMutations';
import useDocumentOperationsPusher from 'utils/hooks/useDocumentOperationsPusher';

import DefaultPlaceholder from 'components/editor/DefaultPlaceholder';
import Editor from 'components/editor/Editor';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import DocumentToolbar from 'components/editor/toolbar/DocumentToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';
import withMarkdownShortcuts from 'components/editor/withMarkdownShortcuts';
import withInlineDiscussions from 'components/editor/withInlineDiscussions';
import withLinks from 'components/editor/withLinks';
import withPasteShim from 'components/editor/withPasteShim';
import withSectionBreak from 'components/editor/withSectionBreak';
import withCustomKeyboardActions from 'components/editor/withCustomKeyboardActions';
import withImages from 'components/editor/withImages';

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '80px',
});

const DocumentComposer = ({ initialContent, ...props }) => {
  const {
    documentId,
    isModalOpen,
    modalDiscussionId,
    deletedDiscussionId,
    firstMsgDiscussionId,
    inlineDiscussionTopic,
    setDeletedDiscussionId,
    setFirstMsgDiscussionId,
    resetInlineTopic,
  } = useContext(DocumentContext);
  const { contextHighlightId } = inlineDiscussionTopic || {};

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
   * renders, but we need to pass an updated resourceId into withImages().
   * Workaround is to memoize the base editor instance, and extend it by calling
   * withImages() with an updated documentId when needed.
   */
  const contentEditor = useMemo(() => withImages(baseEditor, documentId), [
    baseEditor,
    documentId,
  ]);

  const { content, onChange, ...contentProps } = useContentState({
    editor: contentEditor,
    resourceId: documentId,
    initialContent,
  });
  const { handleUpdate } = useDocumentMutations(contentEditor);
  const coreEditorProps = useCoreEditorProps(contentEditor);
  const handleNewOperations = useDocumentOperationsPusher(contentEditor);

  useAutoSave({ content, handleSave: handleUpdate });

  const onChangeWrapper = value => {
    onChange(value);
    handleNewOperations();
  };

  // Implicit state indicating the inline discussion modal has closed and
  // we should unwrap the placeholder context highlight
  if (!isModalOpen && contextHighlightId) {
    Editor.removeContextHighlight(contentEditor, contextHighlightId);
    resetInlineTopic();
  }

  // Implicit state indicating we are ready to create the inline annotation
  if (modalDiscussionId && contextHighlightId) {
    // TODO (HN): set the context highlight as an inline annotation instead

    // Editor.wrapInlineAnnotation(contentEditor, selection, {
    //   discussionId: modalDiscussionId,
    //   authorId: userId,
    //   isInitialDraft: true, // Toggled to false once first message is created
    // });
    resetInlineTopic();
  }

  if (firstMsgDiscussionId) {
    Editor.updateInlineAnnotation(contentEditor, firstMsgDiscussionId, {
      isInitialDraft: false,
    });
    setFirstMsgDiscussionId(null);
  }

  if (deletedDiscussionId) {
    Editor.removeInlineAnnotation(contentEditor, deletedDiscussionId);
    setDeletedDiscussionId(null);
  }

  return (
    <Slate editor={contentEditor} onChange={onChangeWrapper} {...contentProps}>
      <DocumentEditable {...props} {...coreEditorProps} />
      <DocumentToolbar />
      <DefaultPlaceholder />
      <CompositionMenuButton />
    </Slate>
  );
};

DocumentComposer.propTypes = {
  initialContent: PropTypes.string,
};

DocumentComposer.defaultProps = {
  initialContent: '',
};

export default DocumentComposer;
