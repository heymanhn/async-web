import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/shared/Modal';

const InlineDiscussionModal = ({ editor, handleClose, isOpen, ...props }) => {
  return (
    <Modal
      handleClose={handleClose}
      isOpen={isOpen}
      {...props}
    >
      <div>Hello!</div>
    </Modal>
  );
};

InlineDiscussionModal.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default InlineDiscussionModal;
