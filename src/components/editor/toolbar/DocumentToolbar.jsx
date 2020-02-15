import React from 'react';

// import { DocumentContext } from 'utils/contexts';
// import { StartDiscussionButton } from '../plugins/inlineDiscussion';

import Toolbar from './Toolbar';
import FormattingButtons from './FormattingButtons';
import BlockButtons from './BlockButtons';
import VerticalDivider from './VerticalDivider';

const DocumentToolbar = () => {
  // SLATE UPGRADE TODO: inline discussions
  // const { documentId, handleShowModal } = useContext(DocumentContext);

  return (
    <Toolbar>
      <FormattingButtons />
      <VerticalDivider />
      <BlockButtons />
      <VerticalDivider />
      {/* <InlineDiscussionButton /> */}
    </Toolbar>
  );
};

export default DocumentToolbar;
