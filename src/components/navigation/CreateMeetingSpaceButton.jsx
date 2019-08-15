import React, { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import CreateMeetingSpaceModal from 'components/meeting/CreateMeetingSpaceModal';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '16px',
  margin: '0 10px',
  textDecoration: 'none',
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'none',
    color: colors.grey2,
  },
}));

const CreateMeetingSpaceButton = () => {
  const [isModalOpen, setModalVisibility] = useState(false);
  function launchModal() {
    setModalVisibility(true);
  }
  function toggleModal() {
    setModalVisibility(!isModalOpen);
  }

  return (
    <React.Fragment>
      <StyledIcon icon={faPlus} onClick={launchModal} />
      <CreateMeetingSpaceModal
        isOpen={isModalOpen}
        toggle={toggleModal}
      />
    </React.Fragment>
  );
};

export default CreateMeetingSpaceButton;
