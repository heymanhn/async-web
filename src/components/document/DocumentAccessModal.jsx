import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Modal from 'components/shared/Modal';
import ParticipantsList from './ParticipantsList';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  border: 'none',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.08)',
  marginTop: '200px',
  width: '450px',
});

const customBackdropStyle = {
  background: 'black',
  opacity: 0.4,
};

const Header = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
  padding: '15px 25px',
}));

const Contents = styled.div({
  padding: '20px 25px 25px',
});

const DocumentAccessModal = ({
  documentId,
  handleClose,
  isOpen,
}) => (
  <StyledModal
    backdropStyle={customBackdropStyle}
    handleClose={handleClose}
    isOpen={isOpen}
  >
    <Header>Share this Document</Header>
    <Contents>
      <ParticipantsList documentId={documentId} />
    </Contents>
  </StyledModal>
);

DocumentAccessModal.propTypes = {
  documentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default DocumentAccessModal;
