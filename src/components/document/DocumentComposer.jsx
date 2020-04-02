import React, { useContext, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Pusher from 'pusher-js';
import camelcaseKeys from 'camelcase-keys';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import { DocumentContext } from 'utils/contexts';
import useContentState from 'utils/hooks/useContentState';
import useAutoSave from 'utils/hooks/useAutoSave';
import useDocumentMutations from 'utils/hooks/useDocumentMutations';

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

const {
  REACT_APP_ASYNC_API_URL,
  REACT_APP_PUSHER_APP_KEY,
  REACT_APP_PUSHER_APP_CLUSTER,
} = process.env;

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  letterSpacing: '-0.011em',
  marginBottom: '80px',
});

const DocumentComposer = ({ initialContent, ...props }) => {
  const isRemoteChangeRef = useRef(false);
  const {
    documentId,
    modalDiscussionId,
    deletedDiscussionId,
    firstMsgDiscussionId,
    inlineDiscussionTopic,
    setDeletedDiscussionId,
    setFirstMsgDiscussionId,
    resetInlineTopic,
  } = useContext(DocumentContext);
  const { selection } = inlineDiscussionTopic || {};
  const { userId } = getLocalUser();

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

  const { content, ...contentProps } = useContentState({
    editor: contentEditor,
    resourceType: 'document',
    resourceId: documentId,
    initialContent,
    isRemoteChangeRef,
  });
  const { handleUpdate } = useDocumentMutations(contentEditor);
  const coreEditorProps = useCoreEditorProps(contentEditor);

  useAutoSave({ content, handleSave: handleUpdate });

  // TODO (HN): DRY up this code later
  useEffect(() => {
    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    const channelName = `private-channel-${userId}`;
    const channel = pusher.subscribe(channelName);

    const handleNewOperations = data => {
      const camelData = camelcaseKeys(data, { deep: true });
      const { documentId: targetDocumentId, operations } = camelData;

      if (documentId === targetDocumentId) {
        isRemoteChangeRef.current = true;
        Editor.withoutNormalizing(contentEditor, () => {
          operations.forEach(op => contentEditor.apply(op));
        });
      }
    };

    channel.bind('client-new-document-operations', handleNewOperations);

    return () => {
      channel.unbind('client-new-document-operations', handleNewOperations);
    };
  }, [documentId, userId, contentEditor]);

  // Implicit state indicating we are ready to create the inline annotation
  if (modalDiscussionId && selection) {
    Editor.wrapInlineAnnotation(contentEditor, selection, {
      discussionId: modalDiscussionId,
      authorId: userId,
      isInitialDraft: true, // Toggled to false once first message is created
    });
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
    <Slate editor={contentEditor} {...contentProps}>
      <DocumentEditable {...props} {...coreEditorProps} />
      <DocumentToolbar content={content} />
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
