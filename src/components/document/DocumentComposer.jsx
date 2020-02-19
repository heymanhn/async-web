import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import useAutoSave from 'utils/hooks/useAutoSave';

import Editor from 'components/editor/Editor';
import { DEFAULT_ELEMENT } from 'components/editor/utils';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import DocumentToolbar from 'components/editor/toolbar/DocumentToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';
import withMarkdownShortcuts from 'components/editor/withMarkdownShortcuts';
import withInlineDiscussions from 'components/editor/withInlineDiscussions';
import withLinks from 'components/editor/withLinks';
import withPasteShim from 'components/editor/withPasteShim';
import withVoidElements from 'components/editor/withVoidElements';
import withCustomKeyboardActions from 'components/editor/withCustomKeyboardActions';
import useDocumentMutations from './useDocumentMutations';

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

const DocumentComposer = ({ afterUpdate, initialContent, ...props }) => {
  const {
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
  const [content, setContent] = useState(
    initialContent ? JSON.parse(initialContent) : DEFAULT_ELEMENT
  );
  const { handleUpdate } = useDocumentMutations(contentEditor);
  const coreEditorProps = useCoreEditorProps(contentEditor);

  useAutoSave(content, async () => {
    await handleUpdate();
    afterUpdate();
  });

  if (modalDiscussionId && selection) {
    Editor.wrapInlineAnnotation(contentEditor, modalDiscussionId, selection);
    resetInlineTopic();
  }

  if (deletedDiscussionId) {
    Editor.removeInlineAnnotation(contentEditor, deletedDiscussionId);
    setDeletedDiscussionId(null);
  }

  return (
    <Slate editor={contentEditor} value={content} onChange={v => setContent(v)}>
      <DocumentEditable {...props} {...coreEditorProps} />
      <DocumentToolbar content={content} />
      <CompositionMenuButton />
    </Slate>
  );
};

DocumentComposer.propTypes = {
  afterUpdate: PropTypes.func.isRequired,
  initialContent: PropTypes.string,
};

DocumentComposer.defaultProps = {
  initialContent: '',
};

export default DocumentComposer;
