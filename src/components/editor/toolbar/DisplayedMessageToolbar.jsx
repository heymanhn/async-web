import React from 'react';

import DOMToolbar from './DOMToolbar';
import InlineDiscussionButton from './InlineDiscussionButton';

const DisplayedMessageToolbar = props => (
  <DOMToolbar {...props}>
    <InlineDiscussionButton />
  </DOMToolbar>
);

export default DisplayedMessageToolbar;
