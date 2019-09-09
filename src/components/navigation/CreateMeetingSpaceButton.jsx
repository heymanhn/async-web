import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/pro-regular-svg-icons';
import styled from '@emotion/styled';

import CreateMeetingSpaceModal from 'components/meeting/CreateMeetingSpaceModal';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '18px',
  textDecoration: 'none',
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'none',
    color: colors.grey5,
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
      <StyledIcon icon={faPlusCircle} onClick={launchModal} />
      <CreateMeetingSpaceModal
        isOpen={isModalOpen}
        toggle={toggleModal}
      />
    </React.Fragment>
  );
};

export default CreateMeetingSpaceButton;
