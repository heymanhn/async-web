import React, { useContext } from 'react';

import { DiscussionContext, ThreadContext } from 'utils/contexts';

import DOMToolbar from './DOMToolbar';
import StartInlineThreadButton from './StartInlineThreadButton';

const ReadOnlyMessageToolbar = props => {
  const { handleShowThread } = useContext(DiscussionContext);
  const { threadId } = useContext(ThreadContext);

  if (threadId) return null;

  return (
    <DOMToolbar {...props}>
      <StartInlineThreadButton handleShowThread={handleShowThread} />
    </DOMToolbar>
  );
};

export default ReadOnlyMessageToolbar;
