import { useMemo } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { compose } from 'recompose';

import withMarkdownShortcuts from '../withMarkdownShortcuts';
import withInlineDiscussions from '../withInlineDiscussions';
import withLinks from '../withLinks';
import withPasteShim from '../withPasteShim';
import withSectionBreak from '../withSectionBreak';
import withCustomKeyboardActions from '../withCustomKeyboardActions';
import withImages from '../withImages';

const useDocumentEditor = documentId => {
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
  const editor = useMemo(() => withImages(baseEditor, documentId), [
    baseEditor,
    documentId,
  ]);

  return editor;
};

export default useDocumentEditor;
