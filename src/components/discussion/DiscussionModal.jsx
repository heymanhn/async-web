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
  <StyledModal
    handleClose={handleClose}
    isOpen={isOpen}
    {...props}
  >
    <DiscussionContainer
      createAnnotation={createAnnotation}
      discussionId={isOpen ? discussionId : null}
      documentId={isOpen ? documentId : null}
      handleCancel={handleClose}
    />
  </StyledModal>
);

DiscussionModal.propTypes = {
  createAnnotation: PropTypes.func.isRequired,
  discussionId: PropTypes.string,
  documentEditor: PropTypes.object,
  documentId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selection: PropTypes.object,
};

DiscussionModal.defaultProps = {
  discussionId: null,
  documentEditor: {},
  documentId: null,
  selection: {},
};

export default DiscussionModal;
