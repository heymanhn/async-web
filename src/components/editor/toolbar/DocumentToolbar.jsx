import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from './Toolbar';
import FormattingButtons from './FormattingButtons';
import BlockButtons from './BlockButtons';
import VerticalDivider from './VerticalDivider';
import InlineDiscussionButton from './InlineDiscussionButton';

const DocumentToolbar = ({ content, ...props }) => (
  <Toolbar {...props}>
    <FormattingButtons />
    <VerticalDivider />
    <BlockButtons />
    <VerticalDivider />
    <InlineDiscussionButton content={content} />
  </Toolbar>
);

DocumentToolbar.propTypes = {
  content: PropTypes.array.isRequired,
};

export default DocumentToolbar;
