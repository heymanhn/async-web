import { useContext } from 'react';
import { Transforms } from 'slate';

import { DocumentContext } from 'utils/contexts';

import Editor from 'components/editor/Editor';
import { CONTEXT_HIGHLIGHT, BUFFER_LENGTH } from 'components/editor/utils';

const useContextGenerator = editor => {
  const {
    inlineDiscussionTopic: { contextHighlightId, content },
  } = useContext(DocumentContext);

  // const extractContents = () => {
  //   const {
  //     selection,
  //     content: documentContent,
  //   } = inlineDiscussionTopic;

  //   const [start, end] = Range.edges(selection);
  //   const endRange = end.path[0] + 1;
  //   const newContents = [...documentContent].slice(start.path[0], endRange);

  //   // Need to adjust the selection point paths based on the clipped contents
  //   const newSelection = {
  //     anchor: {
  //       ...start,
  //       path: [0, ...start.path.slice(1)],
  //     },
  //     focus: {
  //       ...end,
  //       path: [newContents.length - 1, ...end.path.slice(1)],
  //     },
  //   };
  //   return [newContents, newSelection];
  // };

  // Assumes that a highlight has been made
  // Only truncates from each end if there is too much content after the selection
  const deleteSurroundingText = () => {
    const [, path] = Editor.findNodeByTypeAndId(
      editor,
      CONTEXT_HIGHLIGHT,
      contextHighlightId
    );

    // Delete the end first so that the selection paths don't change
    const endSelection = {
      anchor: Editor.end(editor, path),
      focus: Editor.end(editor, []),
    };
    Transforms.select(editor, endSelection);

    const endText = Editor.string(editor, endSelection);
    if (endText.length > BUFFER_LENGTH) {
      Transforms.move(editor, { edge: 'anchor', distance: BUFFER_LENGTH });
      Transforms.delete(editor);
      Transforms.insertText(editor, '...');
    }

    // Then deal with the start portion
    const startSelection = {
      anchor: Editor.start(editor, []),
      focus: Editor.start(editor, path),
    };
    Transforms.select(editor, startSelection);

    const startText = Editor.string(editor, startSelection);
    if (startText.length > BUFFER_LENGTH) {
      Transforms.move(editor, {
        edge: 'focus',
        distance: BUFFER_LENGTH,
        reverse: true,
      });
      Transforms.delete(editor);
      Transforms.insertText(editor, '...');
    }

    // Prevents the DOM range from overlapping with other Slate instances
    Transforms.deselect(editor);
  };

  return () => {
    // const [newContents, newSelection] = extractContents();

    // Needed to avoid editor focus issues relating to shallow references.
    const deepNewContents = JSON.parse(JSON.stringify(content));

    Transforms.insertNodes(editor, deepNewContents);

    // deleteSurroundingText();
  };
};

export default useContextGenerator;
