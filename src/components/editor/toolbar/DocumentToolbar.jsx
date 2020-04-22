import React, { useContext } from 'react';

import { DocumentContext } from 'utils/contexts';

import Toolbar from './Toolbar';
import FormattingButtons from './FormattingButtons';
import BlockButtons from './BlockButtons';
import VerticalDivider from './VerticalDivider';
import InlineDiscussionButton from './InlineDiscussionButton';

const DocumentToolbar = props => {
  const { handleShowModal } = useContext(DocumentContext);
  return (
    <Toolbar {...props}>
      <FormattingButtons />
      <VerticalDivider />
      <BlockButtons />
      <VerticalDivider />
      <InlineDiscussionButton handleShowModal={handleShowModal} />
    </Toolbar>
  );
};

export default DocumentToolbar;
