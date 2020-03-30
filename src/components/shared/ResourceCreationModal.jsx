import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { DEFAULT_ACCESS_TYPE } from 'utils/constants';
import { DEFAULT_NAVIGATION_CONTEXT, NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';
import useCurrentUser from 'utils/hooks/useCurrentUser';
import useWorkspaceMutations from 'utils/hooks/useWorkspaceMutations';

import Modal from 'components/shared/Modal';
import InputWithIcon from 'components/shared/InputWithIcon';
import OrganizationSearch from 'components/shared/OrganizationSearch';
import Button from 'components/shared/Button';
import ParticipantsList from 'components/participants/ParticipantsList';

const ICON_FOR_RESOURCE_TYPE = {
  workspace: 'layer-group',
  discussion: 'comments-alt',
};

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  margin: `${window.innerHeight * 0.2}px auto`,
  width: '400px',
});

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px 25px',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

const CloseIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '16px',
}));

const Contents = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '20px',
});

const StyledInput = styled(InputWithIcon)({
  marginBottom: '20px',
});

const StyledParticipantsList = styled(ParticipantsList)({
  margin: '0 25px 30px',
});

const CreateButton = styled(Button)({
  alignSelf: 'flex-end',
  marginRight: '25px',
  padding: '4px 20px 6px',
});

const ResourceCreationModal = ({ resourceType, handleClose, isOpen }) => {
  const currentUser = useCurrentUser();
  const {
    handleCreate,
    handleAddMember,
    isSubmitting,
  } = useWorkspaceMutations();

  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const [title, setTitle] = useState('');

  // Keep track of the list of participants locally first. Then, add them to the
  // workspace after it's created.
  const owner = { user: currentUser, accessType: 'owner' };
  const [participants, setParticipants] = useState(
    currentUser.id ? [owner] : []
  );

  // In case current user isn't available immediately from the query
  if (!participants.length && currentUser) setParticipants([owner]);

  const handleAdd = user => {
    setParticipants([
      ...participants,
      { user, accessType: DEFAULT_ACCESS_TYPE },
    ]);
  };

  const handleRemove = userId => {
    const index = participants.findIndex(p => p.user.id === userId);
    setParticipants([
      ...participants.slice(0, index),
      ...participants.slice(index + 1),
    ]);
  };

  const handleCreateWorkspace = async () => {
    const { workspaceId } = await handleCreate(title);

    if (workspaceId) {
      participants
        .filter(p => p.user.id !== currentUser.id)
        .forEach(p => handleAddMember(workspaceId, p.user.id));

      navigate(`/workspaces/${workspaceId}`);
      handleClose();
    } else {
      throw new Error('Unable to create workspace');
    }
  };

  const value = {
    ...DEFAULT_NAVIGATION_CONTEXT,
    resource: { resourceType },
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen}>
      <Header onClick={handleHideDropdown}>
        <Title>{`New ${titleize(resourceType)}`}</Title>
        <CloseIcon icon={['far', 'times']} onClick={handleClose} />
      </Header>
      <Contents onClick={handleHideDropdown}>
        <StyledInput
          icon={ICON_FOR_RESOURCE_TYPE[resourceType]}
          placeholder="Give it a name"
          value={title}
          setValue={setTitle}
          autoFocus
        />
        <NavigationContext.Provider value={value}>
          <OrganizationSearch
            isModalOpen={isOpen}
            isDropdownVisible={isDropdownVisible}
            currentMembers={participants.map(p => p.user)}
            handleAdd={handleAdd}
            handleShowDropdown={handleShowDropdown}
            handleHideDropdown={handleHideDropdown}
            handleCloseModal={handleClose}
          />
        </NavigationContext.Provider>
        <StyledParticipantsList
          participants={participants}
          handleRemove={handleRemove}
        />
        <CreateButton
          onClick={handleCreateWorkspace}
          isDisabled={!title}
          loading={isSubmitting}
          title="Create"
        />
      </Contents>
    </StyledModal>
  );
};

ResourceCreationModal.propTypes = {
  resourceType: PropTypes.oneOf(['workspace', 'discussion']).isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ResourceCreationModal;
