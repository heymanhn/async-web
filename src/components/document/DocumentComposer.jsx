import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import useContentState from 'utils/hooks/useContentState';
import useAutoSave from 'utils/hooks/useAutoSave';
import useDocumentMutations from 'utils/hooks/useDocumentMutations';

import Editor from 'components/editor/Editor';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import DocumentToolbar from 'components/editor/toolbar/DocumentToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';
import withMarkdownShortcuts from 'components/editor/withMarkdownShortcuts';
import withInlineDiscussions from 'components/editor/withInlineDiscussions';
import withLinks from 'components/editor/withLinks';
import withPasteShim from 'components/editor/withPasteShim';
import withVoidElements from 'components/editor/withVoidElements';
import withCustomKeyboardActions from 'components/editor/withCustomKeyboardActions';

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  letterSpacing: '-0.011em',
  marginBottom: '80px',
});

/*
 * IMAGE SUPPORT TODO:
 * - Figure out how to pass resourceId to the image plugin
 */

const DocumentComposer = ({ initialContent, ...props }) => {
  const {
    documentId,
    modalDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,
    setDeletedDiscussionId,
    resetInlineTopic,
  } = useContext(DocumentContext);
  const { selection } = inlineDiscussionTopic || {};

  const contentEditor = useMemo(
    () =>
      compose(
        withCustomKeyboardActions,
        withMarkdownShortcuts,
        withLinks,
        withInlineDiscussions,
        withVoidElements,
        withPasteShim,
        withHistory,
        withReact
      )(createEditor()),
    []
  );
  const { content, ...contentProps } = useContentState({
    resourceId: documentId,
    initialContent,
  });
  const { handleUpdate } = useDocumentMutations(contentEditor);
  const coreEditorProps = useCoreEditorProps(contentEditor);

  useAutoSave(content, handleUpdate);

  if (modalDiscussionId && selection) {
    Editor.wrapInlineAnnotation(contentEditor, modalDiscussionId, selection);
    resetInlineTopic();
  }

  if (deletedDiscussionId) {
    Editor.removeInlineAnnotation(contentEditor, deletedDiscussionId);
    setDeletedDiscussionId(null);
  }

  return (
    <Slate editor={contentEditor} {...contentProps}>
      <DocumentEditable {...props} {...coreEditorProps} />
      <DocumentToolbar content={content} />
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
