import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import ResourceCreationModal from 'components/shared/ResourceCreationModal';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '16px',
  textDecoration: 'none',
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'none',
    color: colors.grey2,
  },
}));

const CreateWorkspaceButton = () => {
  const [isModalOpen, setModalVisibility] = useState(false);
  const launchModal = () => setModalVisibility(true);
  const closeModal = () => setModalVisibility(false);

  return (
    <>
      <StyledIcon icon={['far', 'plus-circle']} onClick={launchModal} />
      <ResourceCreationModal
        resourceType="workspace"
        isOpen={isModalOpen}
        handleClose={closeModal}
      />
    </>
  );
};

export default CreateWorkspaceButton;
