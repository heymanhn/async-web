import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Modal from 'components/shared/Modal';

const StyledModal = styled(Modal)({
  alignSelf: 'center',
});

const customBackdropStyle = {
  background: 'black',
  opacity: 0.4,
};

const DocumentAccessModal = ({
  handleClose,
  isOpen,
}) => (
  <StyledModal
    backdropStyle={customBackdropStyle}
    handleClose={handleClose}
    isOpen={isOpen}
  >
    <div>Hello</div>
  </StyledModal>
);

DocumentAccessModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default DocumentAccessModal;
