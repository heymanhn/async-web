import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import addMemberMutation from 'graphql/mutations/addMember';
import removeMemberMutation from 'graphql/mutations/removeMember';
import localAddMemberMutation from 'graphql/mutations/local/addMember';
import localRemoveMemberMutation from 'graphql/mutations/local/removeMember';
import addToWorkspaceMtn from 'graphql/mutations/addToWorkspace';
import removeFromWorkspaceMtn from 'graphql/mutations/removeFromWorkspace';
import localAddToWorkspaceMtn from 'graphql/mutations/local/addToWorkspace';
import { DEFAULT_ACCESS_TYPE } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';
import { snakedQueryParams } from 'utils/queryParams';

import Modal from 'components/shared/Modal';
import OrganizationSearch from 'components/shared/OrganizationSearch';
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
  const { resourceType, resourceId, resourceQuery, createVariables } = resource;
  const resourceMembersType = Pluralize(resourceType);

  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const [addMember] = useMutation(addMemberMutation);
  const [localAddMember] = useMutation(localAddMemberMutation);

  const [removeMember] = useMutation(removeMemberMutation, {
    variables: {
      resourceType: resourceMembersType,
      resourceId,
    },
  });
  const [localRemoveMember] = useMutation(localRemoveMemberMutation, {
    variables: {
      resourceType: resourceMembersType,
      resourceId,
    },
  });

  const [addToWorkspace] = useMutation(addToWorkspaceMtn, {
    variables: { input: { resourceType, resourceId } },
  });
  const [localAddToWorkspace] = useMutation(localAddToWorkspaceMtn, {
    variables: { resource },
  });

  const [removeFromWorkspace] = useMutation(removeFromWorkspaceMtn, {
    variables: { queryParams: snakedQueryParams({ resourceType, resourceId }) },
  });

  const { data } = useQuery(resourceQuery, {
    variables: createVariables(resourceId),
  });
  if (!data || !data[resourceType]) return null;
  const { title, topic, workspaces } = data[resourceType];
  const { text } = topic || {};
  const resourceTitle = title || text || `Untitled ${titleize(resourceType)}`;
  const currentWorkspaceId = workspaces ? workspaces[0] : null;

  const handleAddMember = user => {
    addMember({
      variables: {
        resourceType: resourceMembersType,
        resourceId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddMember({
      variables: {
        resourceType: resourceMembersType,
        resourceId,
        user,
        accessType: DEFAULT_ACCESS_TYPE,
      },
    });
  };

  const handleRemoveMember = userId => {
    removeMember({ variables: { userId } });
    localRemoveMember({ variables: { userId } });
  };

  const handleAddToWorkspace = workspaceId => {
    addToWorkspace({ variables: { workspaceId } });
    localAddToWorkspace({ variables: { workspaceId } });
    // TODO: Local mutation
  };

  const handleRemoveFromWorkspace = workspaceId => {
    removeFromWorkspace({ variables: { workspaceId } });
    // TODO: Local mutation
  };

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
        {currentWorkspaceId && (
          <WorkspaceRow
            workspaceId={currentWorkspaceId}
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
