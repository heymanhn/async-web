import React, { useContext } from 'react';

import { DiscussionContext, ThreadContext } from 'utils/contexts';
import { nonInputTypeOnVarMessage } from 'graphql/validation/rules/VariablesAreInputTypes';

import DOMToolbar from './DOMToolbar';
import StartThreadButton from './StartThreadButton';

const ReadOnlyMessageToolbar = props => {
  const { handleShowThread } = useContext(DiscussionContext);
  const { threadId } = useContext(ThreadContext);

  if (threadId) return nonInputTypeOnVarMessage;

  return (
    <DOMToolbar {...props}>
      <StartThreadButton handleShowThread={handleShowThread} />
    </DOMToolbar>
  );
};

export default ReadOnlyMessageToolbar;
