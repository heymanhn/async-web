import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Modal from 'components/shared/Modal';

const StyledModal = styled(Modal)({
  alignSelf: 'center',
});

const InlineDiscussionModal = ({ editor, handleClose, isOpen, ...props }) => {
  return (
    <StyledModal
      handleClose={handleClose}
      isOpen={isOpen}
      {...props}
    >
      <div>Hello!</div>
    </StyledModal>
  );
};

InlineDiscussionModal.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default InlineDiscussionModal;
