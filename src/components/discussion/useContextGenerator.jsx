import { useContext } from 'react';
import { Transforms } from 'slate';

import { DocumentContext, DiscussionContext } from 'utils/contexts';
import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';

import Editor from 'components/editor/Editor';
import { CONTEXT_HIGHLIGHT, BUFFER_LENGTH } from 'components/editor/utils';

const useContextGenerator = editor => {
  const {
    inlineDiscussionTopic: content,
    modalDiscussionId,
    resetInlineTopic,
  } = useContext(DocumentContext);
  const { context, setContext } = useContext(DiscussionContext);
  const { handleUpdateContext } = useDiscussionMutations();

  const loadContents = id => {
    // Needed to avoid editor focus issues relating to shallow references.
    const deepNewContents = JSON.parse(JSON.stringify(content));
    Transforms.insertNodes(editor, deepNewContents);

    // Convert inline annotation into a context highlight
    Editor.updateInlineAnnotation(editor, modalDiscussionId, {
      type: CONTEXT_HIGHLIGHT,
      id,
      discussionId: undefined,
      isInitialDraft: undefined,
    });
  };

  // Assumes that a highlight has been made
  // Only truncates from each end if there is too much content after the selection
  const deleteSurroundingText = id => {
    const [, path] = Editor.findNodeByTypeAndId(editor, CONTEXT_HIGHLIGHT, id);

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
    const id = Date.now();
    loadContents(id);
    deleteSurroundingText(id);

    handleUpdateContext(editor.children);
    setContext(editor.children);
    resetInlineTopic();
  };
};

export default useContextGenerator;
