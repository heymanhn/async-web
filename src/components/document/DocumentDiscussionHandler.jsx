import React from 'react';
import PropTypes from 'prop-types';

import DocumentContainer from 'components/document/DocumentContainer';

const DocumentDiscussionHandler = ({ documentId, discussionId }) => {
  return (
    <DocumentContainer documentId={documentId} discussionId={discussionId} />
  );
};

DocumentDiscussionHandler.propTypes = {
  documentId: PropTypes.string.isRequired,
  discussionId: PropTypes.string.isRequired,
};

export default DocumentDiscussionHandler;
