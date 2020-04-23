import { useMemo } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { compose } from 'recompose';

import withCustomKeyboardActions from 'components/editor/plugins/withCustomKeyboardActions';
import withImages from 'components/editor/plugins/withImages';
import withThreads from 'components/editor/plugins/withThreads';
import withLinks from 'components/editor/plugins/withLinks';
import withMarkdownShortcuts from 'components/editor/plugins/withMarkdownShortcuts';
import withPasteShim from 'components/editor/plugins/withPasteShim';
import withSectionBreak from 'components/editor/plugins/withSectionBreak';

const useDocumentEditor = documentId => {
  const baseEditor = useMemo(
    () =>
      compose(
        withCustomKeyboardActions,
        withMarkdownShortcuts,
        withLinks,
        withThreads,
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
