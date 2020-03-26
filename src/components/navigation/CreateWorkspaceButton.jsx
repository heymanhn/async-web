import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

// import CreateMeetingSpaceModal from 'components/meeting/CreateMeetingSpaceModal';

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
  // const [isModalOpen, setModalVisibility] = useState(false);
  // const launchModal = () => setModalVisibility(true);
  // const toggleModal = () => setModalVisibility(!isModalOpen);

  return (
    <>
      <StyledIcon icon={['far', 'plus-circle']} /* onClick={launchModal} */ />
      {/* <CreateMeetingSpaceModal
        isOpen={isModalOpen}
        toggle={toggleModal}
      /> */}
    </>
  );
};

export default CreateWorkspaceButton;
