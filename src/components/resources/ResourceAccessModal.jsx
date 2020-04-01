import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';
import useResourceAccessMutations from 'utils/hooks/useResourceAccessMutations';
import { titleize } from 'utils/helpers';

import Modal from 'components/shared/Modal';
import OrganizationSearch from './OrganizationSearch';
import ParticipantsList from './ParticipantsList';
import WorkspaceRow from './WorkspaceRow';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  margin: `${window.innerHeight * 0.2}px auto`,
  width: '400px',
});

const Header = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
  padding: '15px 25px',
}));

const ResourceTitle = styled.span({
  fontWeight: 600,
  marginLeft: '4px',
});

const Contents = styled.div({
  padding: '0 25px 25px',
});

const StyledOrganizationSearch = styled(OrganizationSearch)({
  marginLeft: '-25px',
  marginRight: '-25px',
});

const ResourceAccessModal = ({ handleClose, isOpen, participants }) => {
  const { resource } = useContext(NavigationContext);
  const { resourceType, resourceId, resourceQuery, variables } = resource;
  const {
    handleAddMember,
    handleRemoveMember,
    handleAddToWorkspace,
    handleRemoveFromWorkspace,
  } = useResourceAccessMutations(resourceType, resourceId);

  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const { data } = useQuery(resourceQuery, {
    variables,
  });
  if (!data || !data[resourceType]) return null;

  const { title, topic, workspaces } = data[resourceType];
  const { text } = topic || {};
  const resourceTitle = title || text || `Untitled ${titleize(resourceType)}`;
  const parentWorkspaceId = workspaces ? workspaces[0] : null;

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen}>
      <Header onClick={handleHideDropdown}>
        Share
        <ResourceTitle>{resourceTitle}</ResourceTitle>
      </Header>
      <Contents onClick={handleHideDropdown}>
        <StyledOrganizationSearch
          autoFocus
          isModalOpen={isOpen}
          isDropdownVisible={isDropdownVisible}
          currentMembers={participants.map(p => p.user)}
          parentWorkspaceId={parentWorkspaceId}
          handleAddMember={handleAddMember}
          handleAddToWorkspace={handleAddToWorkspace}
          handleShowDropdown={handleShowDropdown}
          handleHideDropdown={handleHideDropdown}
          handleCloseModal={handleClose}
        />
        <ParticipantsList
          participants={participants}
          handleRemove={handleRemoveMember}
        />
        {parentWorkspaceId && (
          <WorkspaceRow
            workspaceId={parentWorkspaceId}
            handleRemove={handleRemoveFromWorkspace}
          />
        )}
      </Contents>
    </StyledModal>
  );
};

ResourceAccessModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  participants: PropTypes.array.isRequired,
};

export default ResourceAccessModal;
