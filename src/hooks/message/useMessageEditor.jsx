import { useMemo } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { compose } from 'recompose';

import withCustomKeyboardActions from 'plugins/editor/withCustomKeyboardActions';
import withImages from 'plugins/editor/withImages';
import withThreads from 'plugins/editor/withThreads';
import withLinks from 'plugins/editor/withLinks';
import withMarkdownShortcuts from 'plugins/editor/withMarkdownShortcuts';
import withPasteShim from 'plugins/editor/withPasteShim';
import withSectionBreak from 'plugins/editor/withSectionBreak';

const useMessageEditor = parentId => {
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
   * renders, but we need to pass component-specific data to some HOCs.
   * Workaround is to memoize the base editor instance, and extend it by calling
   * withImages() with the updated variables.
   */
  const editor = useMemo(() => withImages(baseEditor, parentId), [
    baseEditor,
    parentId,
  ]);

  return editor;
};

export default useMessageEditor;
