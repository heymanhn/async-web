import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';

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
  const { setResourceCreationModalMode } = useContext(NavigationContext);
  const launchModal = () => setResourceCreationModalMode('workspace');

  return (
    <>
      <StyledIcon icon={['far', 'plus-circle']} onClick={launchModal} />
      <ResourceCreationModal />
    </>
  );
};

export default CreateWorkspaceButton;
