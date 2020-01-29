import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Modal from 'components/shared/Modal';
import DiscussionContainer from './DiscussionContainer';

const StyledModal = styled(Modal)({
  alignSelf: 'center',
});

const DiscussionModal = ({
  createAnnotation,
  discussionId,
  documentId,
  documentEditor,
  handleClose,
  isOpen,
  selection,
  ...props
}) => (
  <StyledModal handleClose={handleClose} isOpen={isOpen} {...props}>
    <DiscussionContainer
      createAnnotation={createAnnotation}
      discussionId={isOpen ? discussionId : null}
      documentEditor={documentEditor}
      documentId={isOpen ? documentId : null}
      handleCancel={handleClose}
      selection={selection}
    />
  </StyledModal>
);

DiscussionModal.propTypes = {
  createAnnotation: PropTypes.func,
  discussionId: PropTypes.string,
  documentEditor: PropTypes.object,
  documentId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selection: PropTypes.object,
};

DiscussionModal.defaultProps = {
  createAnnotation: () => {},
  discussionId: null,
  documentEditor: {},
  documentId: null,
  selection: {},
};

export default DiscussionModal;
