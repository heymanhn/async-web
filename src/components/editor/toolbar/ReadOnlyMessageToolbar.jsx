import React, { useContext } from 'react';

import { DiscussionContext, ThreadContext } from 'utils/contexts';

import DOMToolbar from './DOMToolbar';
import QuoteReplyButton from './QuoteReplyButton';
import StartInlineThreadButton from './StartInlineThreadButton';
import VerticalDivider from './VerticalDivider';

const ReadOnlyMessageToolbar = props => {
  const { handleShowThread } = useContext(DiscussionContext);
  const { threadId } = useContext(ThreadContext);
  const source = threadId ? 'thread' : 'discussion';
  return (
    <DOMToolbar {...props}>
      <QuoteReplyButton source={source} />
      {source === 'discussion' && (
        <>
          <VerticalDivider />
          <StartInlineThreadButton handleShowThread={handleShowThread} />
        </>
      )}
    </DOMToolbar>
  );
};

export default ReadOnlyMessageToolbar;
