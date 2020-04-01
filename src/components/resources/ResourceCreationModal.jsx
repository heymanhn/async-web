import React, { useContext, useState } from 'react';
import { navigate } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { DEFAULT_ACCESS_TYPE, RESOURCE_ICONS } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';
import useCurrentUser from 'utils/hooks/useCurrentUser';
import useResourceCreator from 'utils/hooks/useResourceCreator';

import Modal from 'components/shared/Modal';
import InputWithIcon from 'components/shared/InputWithIcon';
import Button from 'components/shared/Button';
import OrganizationSearch from './OrganizationSearch';
import ParticipantsList from './ParticipantsList';
import WorkspaceRow from './WorkspaceRow';

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

const ResourceCreationModal = props => {
  const navigationContext = useContext(NavigationContext);
  const {
    resourceCreationModalMode: resourceType,
    setResourceCreationModalMode,
  } = navigationContext;

  const { handleCreateResource, isSubmitting } = useResourceCreator(
    resourceType
  );
  const currentUser = useCurrentUser();
  const isOpen = !!resourceType;

  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const [title, setTitle] = useState('');

  // Keep track of the list of participants and the parent workspace
  // locally first. Then, add them to the resource after it's created.
  const owner = { user: currentUser, accessType: 'owner' };
  const [participants, setParticipants] = useState(
    currentUser.id ? [owner] : []
  );
  const [parentWorkspaceId, setParentWorkspaceId] = useState(null);

  if (!resourceType) return null;

  // In case current user isn't available immediately from the query
  if (!participants.length && currentUser) setParticipants([owner]);

  const handleAddMemberWrapper = user => {
    setParticipants([
      ...participants,
      { user, accessType: DEFAULT_ACCESS_TYPE },
    ]);
  };

  const handleRemoveMember = userId => {
    const index = participants.findIndex(p => p.user.id === userId);
    setParticipants([
      ...participants.slice(0, index),
      ...participants.slice(index + 1),
    ]);
  };

  const handleClose = () => setResourceCreationModalMode(null);

  const handleCreate = async () => {
    await handleCreateResource({
      title,
      parentWorkspaceId,
      newMembers: participants,
    });

    handleClose();
  };

  const value = {
    ...navigationContext,
    resource: { resourceType },
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen} {...props}>
      <Header onClick={handleHideDropdown}>
        <Title>{`New ${titleize(resourceType)}`}</Title>
        <CloseIcon icon={['far', 'times']} onClick={handleClose} />
      </Header>
      <Contents onClick={handleHideDropdown}>
        <StyledInput
          icon={RESOURCE_ICONS[resourceType]}
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
            handleAddMember={handleAddMemberWrapper}
            handleAddToWorkspace={setParentWorkspaceId}
            parentWorkspaceId={parentWorkspaceId}
            handleShowDropdown={handleShowDropdown}
            handleHideDropdown={handleHideDropdown}
            handleCloseModal={handleClose}
          />
        </NavigationContext.Provider>
        <StyledParticipantsList
          participants={participants}
          handleRemove={handleRemoveMember}
        />
        {parentWorkspaceId && (
          <WorkspaceRow
            workspaceId={parentWorkspaceId}
            handleRemove={() => setParentWorkspaceId(null)}
          />
        )}
        <CreateButton
          onClick={handleCreate}
          isDisabled={!title}
          loading={isSubmitting}
          title="Create"
        />
      </Contents>
    </StyledModal>
  );
};

export default ResourceCreationModal;
