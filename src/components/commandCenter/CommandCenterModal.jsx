import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { track } from 'utils/analytics';
import useMountEffect from 'utils/hooks/useMountEffect';

import Modal from 'components/shared/Modal';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  border: 'none',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.08)',
  marginTop: '150px',
  width: '600px',
});

const customBackdropStyle = {
  background: 'black',
  opacity: 0.5,
};

const CommandCenterModal = ({ isOpen, handleClose, ...props }) => {
  useMountEffect(() => {
    // Customize sources later
    track('Command Center launched', { source: 'inbox' });
  });

  return (
    <StyledModal
      backdropStyle={customBackdropStyle}
      handleClose={handleClose}
      isOpen={isOpen}
      {...props}
    >
      Hi
    </StyledModal>
  );
};

CommandCenterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CommandCenterModal;
