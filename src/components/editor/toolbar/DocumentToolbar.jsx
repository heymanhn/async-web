import React from 'react';

import Toolbar from './Toolbar';
import FormattingButtons from './FormattingButtons';
import BlockButtons from './BlockButtons';
import VerticalDivider from './VerticalDivider';
import InlineDiscussionButton from './InlineDiscussionButton';

const DocumentToolbar = props => (
  <Toolbar {...props}>
    <FormattingButtons />
    <VerticalDivider />
    <BlockButtons />
    <VerticalDivider />
    <InlineDiscussionButton />
  </Toolbar>
);

export default DocumentToolbar;
