import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import addMemberMutation from 'graphql/mutations/addMember';
import localAddMemberMutation from 'graphql/mutations/local/addMember';
import localRemoveMemberMutation from 'graphql/mutations/local/removeMember';
import removeMemberMutation from 'graphql/mutations/removeMember';

import { DEFAULT_ACCESS_TYPE } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';

import Modal from 'components/shared/Modal';
import OrganizationSearch from 'components/shared/OrganizationSearch';
import ParticipantsList from './ParticipantsList';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  margin: `${window.innerHeight * 0.2}px auto`,
  width: '450px',
});

const Header = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  color: colors.grey4,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
  padding: '15px 25px',
}));

const ResourceTitle = styled.span({
  fontWeight: 600,
});

const Contents = styled.div({
  padding: '20px 25px 25px',
});

const StyledOrganizationSearch = styled(OrganizationSearch)({
  marginLeft: '-25px',
  marginRight: '-25px',
});

const ResourceAccessModal = ({ handleClose, isOpen, participants }) => {
  const {
    resource: { resourceType, resourceId, resourceQuery, createVariables },
  } = useContext(NavigationContext);

  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const [addMember] = useMutation(addMemberMutation);
  const [localAddMember] = useMutation(localAddMemberMutation);

  const [localRemoveMember] = useMutation(localRemoveMemberMutation, {
    variables: {
      resourceType,
      id: resourceId,
    },
  });
  const [removeMember] = useMutation(removeMemberMutation, {
    variables: {
      resourceType,
      id: resourceId,
    },
  });

  const { data } = useQuery(resourceQuery, {
    variables: createVariables(resourceId),
  });
  if (!data || !data[resourceType]) return null;
  const { title, topic } = data[resourceType];
  const { text } = topic || {};
  const resourceTitle = title || text;

  const handleAdd = user => {
    addMember({
      variables: {
        resourceType,
        resourceId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddMember({
      variables: {
        resourceType,
        resourceId,
        user,
        accessType: DEFAULT_ACCESS_TYPE,
      },
    });
  };

  const handleRemove = userId => {
    removeMember({ variables: { userId } });
    localRemoveMember({ variables: { userId } });
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen}>
      <Header onClick={handleHideDropdown}>
        {`Share ${(<ResourceTitle>{resourceTitle}</ResourceTitle>)}`}
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
