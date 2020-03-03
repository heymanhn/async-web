import React, { useContext, useMemo, useState } from 'react';
import { compose } from 'recompose';
import { createEditor, Range, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import { DocumentContext, DiscussionContext } from 'utils/contexts';
import useMountEffect from 'utils/hooks/useMountEffect';

import Editor from 'components/editor/Editor';
import useContextEditorProps from 'components/editor/useContextEditorProps';
import withInlineDiscussions from 'components/editor/withInlineDiscussions';
import withVoidElements from 'components/editor/withVoidElements';
import {
  INLINE_DISCUSSION_SOURCE,
  CONTEXT_HIGHLIGHT,
  BUFFER_LENGTH,
} from 'components/editor/utils';

const ContextEditable = styled(Editable)(({ theme: { colors } }) => ({
  background: colors.grey7,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '-0.011em',
  lineHeight: '26px',
  padding: '10px 30px 5px',

  span: {
    color: `${colors.grey3} !important`,
  },
}));

const ContextComposer = props => {
  const { inlineDiscussionTopic } = useContext(DocumentContext);
  const { context, setContext } = useContext(DiscussionContext);

  const contextEditor = useMemo(
    () =>
      compose(
        withInlineDiscussions,
        withVoidElements,
        withReact
      )(createEditor()),
    []
  );
  const editorProps = useContextEditorProps();
  const [content, setContent] = useState(context || []);

  const extractContents = () => {
    const { selection, content: documentContent } = inlineDiscussionTopic;
    const [start, end] = Range.edges(selection);
    const endRange = end.path[0] + 1;
    const newContents = [...documentContent].slice(start.path[0], endRange);

    // Need to adjust the selection point paths based on the clipped contents
    const newSelection = {
      anchor: {
        ...start,
        path: [0, start.path[1]],
      },
      focus: {
        ...end,
        path: [newContents.length - 1, end.path[1]],
      },
    };
    return [newContents, newSelection];
  };

  // Assumes that a highlight has been made
  const deleteSurroundingText = () => {
    const [, path] = Editor.findNodeByType(contextEditor, CONTEXT_HIGHLIGHT);

    // Delete the end first so that the selection paths don't change
    Transforms.select(contextEditor, {
      anchor: Editor.end(contextEditor, path),
      focus: Editor.end(contextEditor, []),
    });
    Transforms.move(contextEditor, { edge: 'anchor', distance: BUFFER_LENGTH });
    Transforms.delete(contextEditor);
    Transforms.insertText(contextEditor, '...');

    // Then deal with the start portion
    Transforms.select(contextEditor, {
      anchor: Editor.start(contextEditor, []),
      focus: Editor.start(contextEditor, path),
    });
    Transforms.move(contextEditor, {
      edge: 'focus',
      distance: BUFFER_LENGTH,
      reverse: true,
    });
    Transforms.delete(contextEditor);
    Transforms.insertText(contextEditor, '...');

    // Prevents the DOM range from overlapping with other Slate instances
    Transforms.deselect(contextEditor);
  };

  const generateContext = () => {
    if (context) return;

    const [newContents, newSelection] = extractContents();

    // Needed to avoid editor focus issues relating to shallow references.
    const deepNewContents = JSON.parse(JSON.stringify(newContents));

    Transforms.insertNodes(contextEditor, deepNewContents);
    Editor.wrapInline(
      contextEditor,
      CONTEXT_HIGHLIGHT,
      newSelection,
      INLINE_DISCUSSION_SOURCE
    );
    deleteSurroundingText();
  };

  useMountEffect(generateContext);

  if (!context && content.length) setContext(content);

  return (
    <Slate editor={contextEditor} value={content} onChange={v => setContent(v)}>
      <ContextEditable readOnly {...props} {...editorProps} />
    </Slate>
  );
};

export default ContextComposer;
