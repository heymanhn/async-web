import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';
import Modal from 'components/shared/Modal';
import InviteTeam from 'components/auth/InviteTeam';

const StyledModal = styled(Modal)(({ theme: { colors } }) => ({
  alignSelf: 'center',
  background: colors.bgGrey,
}));

const InviteTeamModal = ({ organizationId }) => {
  const { isInviteModalOpen, setIsInviteModalOpen } = useContext(
    NavigationContext
  );

  if (!isInviteModalOpen) return null;

  const handleClose = () => {
    setIsInviteModalOpen(false);
  };

  return (
    <StyledModal isOpen={isInviteModalOpen} handleClose={handleClose}>
      <InviteTeam organizationId={organizationId} />
    </StyledModal>
  );
};

InviteTeamModal.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default InviteTeamModal;
