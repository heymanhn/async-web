import React from 'react';

import Toolbar from './Toolbar';
import FormattingButtons from './FormattingButtons';
import BlockButtons from './BlockButtons';
import VerticalDivider from './VerticalDivider';

const MessageToolbar = () => (
  <Toolbar>
    <FormattingButtons />
    <VerticalDivider />
    <BlockButtons />
  </Toolbar>
);

export default MessageToolbar;
