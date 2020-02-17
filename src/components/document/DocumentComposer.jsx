import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import useAutoSave from 'utils/hooks/useAutoSave';

import { DEFAULT_ELEMENT } from 'components/editor/utils';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import DocumentToolbar from 'components/editor/toolbar/DocumentToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';
import withMarkdownShortcuts from 'components/editor/withMarkdownShortcuts';
import withInlineElements from 'components/editor/withInlineElements';
import withVoidElements from 'components/editor/withVoidElements';
import withCustomBreaks from 'components/editor/withCustomBreaks';
import useDocumentMutations from './useDocumentMutations';

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  letterSpacing: '-0.011em',
  marginBottom: '80px',
});

/*
 * SLATE UPGRADE TODO:
 * - Figure out how to show the inline discussion modal given a discussion ID
 * - Figure out how to pass resourceId to the image plugin
 * - Figure out how plugins are instantiated here
 */

const DocumentComposer = ({ afterUpdate, initialContent, ...props }) => {
  const {
    modalDiscussionId,
    inlineDiscussionTopic,
    resetInlineTopic,
  } = useContext(DocumentContext);
  const { selection } = inlineDiscussionTopic || {};
  const isAnnotationNeeded = modalDiscussionId && selection;

  const contentEditor = useMemo(
    () =>
      compose(
        withCustomBreaks,
        withMarkdownShortcuts,
        withInlineElements,
        withVoidElements,
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

  const createAnnotation = () => {};

  /* SLATE UPGRADE TODO: implement this

function createAnnotation(value, authorId) {
  const { documentEditor, selection } = state;
  const { start, end } = selection;

  documentEditor.withoutSaving(() => {
    documentEditor
      .moveTo(start.key, start.offset)
      .moveEndTo(end.key, end.offset)
      .addMark({
        type: 'inline-discussion',
        data: {
          discussionId: value,
          authorId,
        },
      });
  });
}
*/

  if (isAnnotationNeeded) {
    createAnnotation();
    resetInlineTopic();
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
