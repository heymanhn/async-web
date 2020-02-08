import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import Modal from 'components/shared/Modal';
import OrganizationMemberSearch from './OrganizationMemberSearch';
import ParticipantsList from './ParticipantsList';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  border: 'none',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.08)',
  margin: `${window.innerHeight * 0.2}px auto`,
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

const ResourceAccessModal = ({ handleClose, isOpen }) => {
  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { documentId } = useContext(DocumentContext);

  function handleShowDropdown() {
    setIsDropdownVisible(true);
  }
  function handleHideDropdown() {
    setIsDropdownVisible(false);
  }

  return (
    <StyledModal
      backdropStyle={customBackdropStyle}
      handleClose={handleClose}
      isOpen={isOpen}
    >
      <Header onClick={handleHideDropdown}>
        Share this {documentId ? 'Document' : 'Discussion'}
      </Header>
      <Contents onClick={handleHideDropdown}>
        <OrganizationMemberSearch
          isDropdownVisible={isDropdownVisible}
          handleShowDropdown={handleShowDropdown}
          handleHideDropdown={handleHideDropdown}
        />
        <ParticipantsList />
      </Contents>
    </StyledModal>
  );
};

ResourceAccessModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ResourceAccessModal;