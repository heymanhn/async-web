import React, { useContext } from 'react';

import { DiscussionContext } from 'utils/contexts';

import DOMToolbar from './DOMToolbar';
import InlineDiscussionButton from './InlineDiscussionButton';

const DisplayedMessageToolbar = props => {
  const { handleShowModal } = useContext(DiscussionContext);

  return (
    <DOMToolbar {...props}>
      <InlineDiscussionButton handleShowModal={handleShowModal} />
    </DOMToolbar>
  );
};

export default DisplayedMessageToolbar;
