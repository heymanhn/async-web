import React, { useContext } from 'react';

import { DocumentContext } from 'utils/contexts';

import Toolbar from './Toolbar';
import FormattingButtons from './FormattingButtons';
import BlockButtons from './BlockButtons';
import VerticalDivider from './VerticalDivider';
import StartInlineThreadButton from './StartInlineThreadButton';

const DocumentToolbar = props => {
  const { handleShowThread } = useContext(DocumentContext);

  return (
    <Toolbar {...props}>
      <FormattingButtons />
      <VerticalDivider />
      <BlockButtons />
      <VerticalDivider />
      <StartInlineThreadButton handleShowThread={handleShowThread} />
    </Toolbar>
  );
};

export default DocumentToolbar;
