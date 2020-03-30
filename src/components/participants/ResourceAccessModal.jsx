import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import addMemberMutation from 'graphql/mutations/addMember';
import localAddMemberMutation from 'graphql/mutations/local/addMember';
import localRemoveMemberMutation from 'graphql/mutations/local/removeMember';
import removeMemberMutation from 'graphql/mutations/removeMember';
import { DEFAULT_ACCESS_TYPE } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

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
  const {
    resource: { resourceType, resourceId, resourceQuery, createVariables },
  } = useContext(NavigationContext);
  const resourceMembersType = Pluralize(resourceType);

  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const [addMember] = useMutation(addMemberMutation);
  const [localAddMember] = useMutation(localAddMemberMutation);

  const [localRemoveMember] = useMutation(localRemoveMemberMutation, {
    variables: {
      resourceType: resourceMembersType,
      resourceId,
    },
  });
  const [removeMember] = useMutation(removeMemberMutation, {
    variables: {
      resourceType: resourceMembersType,
      resourceId,
    },
  });

  const { data } = useQuery(resourceQuery, {
    variables: createVariables(resourceId),
  });
  if (!data || !data[resourceType]) return null;
  const { title, topic, workspaces } = data[resourceType];
  const { text } = topic || {};
  const resourceTitle = title || text || `Untitled ${titleize(resourceType)}`;
  const currentWorkspaceId = workspaces ? workspaces[0] : null;

  const handleAdd = user => {
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

  const handleRemove = (type, id) => {
    if (type === 'participant') {
      removeMember({ variables: { userId: id } });
      localRemoveMember({ variables: { userId: id } });
    }
    if (type === 'workspace') {
      // TODO
    }
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
          handleAdd={handleAdd}
          handleShowDropdown={handleShowDropdown}
          handleHideDropdown={handleHideDropdown}
          handleCloseModal={handleClose}
        />
        <ParticipantsList
          participants={participants}
          handleRemove={handleRemove}
        />
        {currentWorkspaceId && (
          <WorkspaceRow workspaceId={currentWorkspaceId} />
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
