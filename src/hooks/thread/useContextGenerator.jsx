import { useContext } from 'react';
import { Transforms } from 'slate';

import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import { DiscussionContext, DocumentContext } from 'utils/contexts';
import { CONTEXT_HIGHLIGHT, BUFFER_LENGTH } from 'utils/editor/constants';

import Editor from 'components/editor/Editor';

const useContextGenerator = editor => {
  // TODO (DISCUSSION V2): Avoid this dance. Be more explicit where to look
  // for the inline discussion topic
  const { inlineDiscussionTopic: documentContent } = useContext(
    DocumentContext
  );
  const { inlineDiscussionTopic: messageContent, discussionId } = useContext(
    DiscussionContext
  );
  const { handleUpdateContext } = useDiscussionMutations();

  const loadContents = id => {
    // Needed to avoid editor focus issues relating to shallow references.
    const deepNewContents = JSON.parse(
      JSON.stringify(documentContent || messageContent)
    );
    Transforms.insertNodes(editor, deepNewContents);

    // Convert inline annotation into a context highlight
    Editor.updateInlineAnnotation(editor, discussionId, {
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
  };
};

export default useContextGenerator;
