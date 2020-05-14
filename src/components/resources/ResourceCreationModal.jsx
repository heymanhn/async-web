import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { DEFAULT_ACCESS_TYPE, RESOURCE_ICONS } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';
import useCurrentUser from 'hooks/shared/useCurrentUser';
import useResourceCreator from 'hooks/resources/useResourceCreator';

import Button from 'components/shared/Button';
import InputWithIcon from 'components/shared/InputWithIcon';
import Modal from 'components/shared/Modal';
import Toggle from 'components/shared/Toggle';
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

const Title = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  color: colors.grey1,
}));

const CloseIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '16px',
}));

const Contents = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 25px 25px',
});

const StyledOrganizationSearch = styled(OrganizationSearch)({
  marginLeft: '-25px',
  marginRight: '-25px',
});

const StyledInput = styled(InputWithIcon)({
  margin: '0 -25px 20px',
  width: 'auto',
});

const PrivateSection = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  background: colors.bgGrey,
  borderTop: `1px solid ${colors.borderGrey}`,
  borderBottom: `1px solid ${colors.borderGrey}`,
  margin: '30px -25px 0',
  padding: '15px 0',
}));

const Info = styled.div({
  marginLeft: '25px',
});

const MakePrivateTitle = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  color: colors.mainText,
}));

const Description = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey1,
}));

const StyledToggle = styled(Toggle)({
  flexShrink: 0,
  marginLeft: '25px',
  marginRight: '25px',
});

const CreateButton = styled(Button)(({ isDisabled, theme: { colors } }) => ({
  alignSelf: 'flex-end',
  background: isDisabled ? colors.grey7 : colors.altBlue,
  marginTop: '20px',
  padding: '4px 20px 6px',
}));

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

  // Only used for workspaces for now. Keeps track of whether it should
  // be created as a private workspace.
  const [isPrivate, setIsPrivate] = useState(false);
  const togglePrivate = () => setIsPrivate(previous => !previous);

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
      accessType: isPrivate ? 'private' : 'protected',
      parentWorkspaceId,
      newMembers: participants,
    });

    handleClose();
  };

  const privateWorkspaceSection = () => (
    <PrivateSection>
      <Info>
        <MakePrivateTitle>Make private?</MakePrivateTitle>
        <Description>
          When selected, only the people added to the workspace can access it.
        </Description>
      </Info>
      <StyledToggle isEnabled={isPrivate} handleToggle={togglePrivate} />
    </PrivateSection>
  );

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
          <StyledOrganizationSearch
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
        <ParticipantsList
          participants={participants}
          handleRemove={handleRemoveMember}
        />
        {parentWorkspaceId && (
          <WorkspaceRow
            workspaceId={parentWorkspaceId}
            handleRemove={() => setParentWorkspaceId(null)}
          />
        )}
        {resourceType === 'workspace' && privateWorkspaceSection()}
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
