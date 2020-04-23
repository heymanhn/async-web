import React, { useContext } from 'react';

import { DiscussionContext } from 'utils/contexts';

import DOMToolbar from './DOMToolbar';
import StartThreadButton from './StartThreadButton';

const ReadOnlyMessageToolbar = props => {
  const { handleShowThread } = useContext(DiscussionContext);

  return (
    <DOMToolbar {...props}>
      <StartThreadButton handleShowThread={handleShowThread} />
    </DOMToolbar>
  );
};

export default ReadOnlyMessageToolbar;
