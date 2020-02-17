import React, { useContext, useMemo, useState } from 'react';
import { compose } from 'recompose';
import { createEditor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import { DocumentContext, DiscussionContext } from 'utils/contexts';
import useMountEffect from 'utils/hooks/useMountEffect';

import Editor from 'components/editor/Editor';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import withInlineElements from 'components/editor/withInlineElements';
import withVoidElements from 'components/editor/withVoidElements';
import { INLINE_DISCUSSION_SOURCE } from 'components/editor/utils';

const ContextEditable = styled(Editable)(({ theme: { colors } }) => ({
  background: colors.grey7,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '-0.011em',
  lineHeight: '26px',
  opacity: 0.6,
  padding: '10px 30px 5px',
}));

const ContextComposer = props => {
  const { inlineDiscussionTopic } = useContext(DocumentContext);
  const { context } = useContext(DiscussionContext);

  const contextEditor = useMemo(
    () =>
      compose(withInlineElements, withVoidElements, withReact)(createEditor()),
    []
  );
  const coreEditorProps = useCoreEditorProps(contextEditor, { readOnly: true });
  const [content, setContent] = useState(context ? JSON.parse(context) : []);

  // Hmm.. how do you load initial content into the editor, dynamically?
  useMountEffect(() => {
    const { selection, content: documentContent } = inlineDiscussionTopic;

    // Step 1: Load the text
    Transforms.insertNodes(contextEditor, documentContent);

    // Step 2: Create a context highlight
    Editor.wrapHighlight(contextEditor, selection, INLINE_DISCUSSION_SOURCE);

    // Step 2: Clip the text we don't want in the highlight
    // Hint: use Transforms.unwrapNodes()
  });

  return (
    <Slate editor={contextEditor} value={content} onChange={v => setContent(v)}>
      <ContextEditable readOnly {...props} {...coreEditorProps} />
    </Slate>
  );
};

export default ContextComposer;

/*
// HN: I know this is a long-winded way to extract the inline discussion context. But we're
// limited by what the Slate API gives us. There must be a better way.
// FUTURE: Use the immutable APIs to dynamically create the context block
function extractContext() {
  const { start, end } = selection;

  // Step 1: Delete everything before the highlight, factoring in some buffer space
  // for the rest of the current block
  documentEditor
    .moveToStartOfDocument()
    .moveEndToStartOfParentBlock(start)
    .delete();

  // Step 2: Delete everything after the highlight, similar to step 2
  documentEditor
    .moveToEndOfDocument()
    .moveStartToEndOfParentBlock(end)
    .delete();

  // Step 3: Create the highlight within the current content
  documentEditor
    .moveStartTo(start.key, start.offset)
    .moveEndTo(end.key, end.offset)
    .wrapInline(CONTEXT_HIGHLIGHT);

  const { value } = documentEditor;
  const initialContext = JSON.stringify(value.toJSON());
  setContext(initialContext);

  // 1. Undo the highlight
  // 2. Undo the end of document delete
  // 3. Undo the beginning of document delete
  documentEditor
    .undo()
    .undo()
    .undo();
}
*/
