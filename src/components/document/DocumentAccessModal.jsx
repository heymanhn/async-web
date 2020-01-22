import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Modal from 'components/shared/Modal';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  border: 'none',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.08)',
  marginTop: '200px',
  width: '400px',
});

const customBackdropStyle = {
  background: 'black',
  opacity: 0.4,
};

const Header = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  fontSize: '14px',
  fontWeight: 500,
  padding: '12px 25px',
}));

const DocumentAccessModal = ({
  handleClose,
  isOpen,
}) => (
  <StyledModal
    backdropStyle={customBackdropStyle}
    handleClose={handleClose}
    isOpen={isOpen}
  >
    <Header>Share this Document</Header>
    <div>Hello</div>
  </StyledModal>
);

DocumentAccessModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default DocumentAccessModal;
