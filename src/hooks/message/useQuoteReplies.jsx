import { useContext, useEffect } from 'react';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import {
  DiscussionContext,
  MessageContext,
  ThreadContext,
} from 'utils/contexts';

import Editor from 'components/editor/Editor';

const useQuoteReplies = (editor, setMessage) => {
  const { mode, parentType } = useContext(MessageContext);
  const { quoteReply, setQuoteReply } = useContext(
    parentType === 'discussion' ? DiscussionContext : ThreadContext
  );

  useEffect(() => {
    // The quote reply will always be added to the end of the content
    if (quoteReply && mode === 'compose') {
      ReactEditor.focus(editor);
      if (!editor.selection) {
        const endPoint = Editor.end(editor, []);
        Transforms.select(editor, endPoint);
      }

      Editor.insertBlockQuote(editor, quoteReply);
      setMessage(editor.children);
      setQuoteReply(null);
    }
  });
};

export default useQuoteReplies;
