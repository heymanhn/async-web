import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import resourceMembersQuery from 'graphql/queries/resourceMembers';
import addMemberMutation from 'graphql/mutations/addMember';
import localAddMemberMutation from 'graphql/mutations/local/addMember';
import { DiscussionContext, DocumentContext } from 'utils/contexts';

import Modal from 'components/shared/Modal';
import OrganizationSearch from 'components/shared/OrganizationSearch';
import ParticipantsList from './ParticipantsList';

const DEFAULT_ACCESS_TYPE = 'collaborator';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  margin: `${window.innerHeight * 0.2}px auto`,
  width: '450px',
});

const Header = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
  padding: '15px 25px',
}));

const Contents = styled.div({
  padding: '20px 25px 25px',
});

const StyledOrganizationSearch = styled(OrganizationSearch)({
  marginLeft: '-25px',
  marginRight: '-25px',
});

const ResourceAccessModal = ({ handleClose, isOpen }) => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);
  const resourceType = documentId ? 'documents' : 'discussions';
  const resourceId = documentId || discussionId;

  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const [addMember] = useMutation(addMemberMutation);
  const [localAddMember] = useMutation(localAddMemberMutation);

  const { loading, data } = useQuery(resourceMembersQuery, {
    variables: { resourceType, id: resourceId },
  });

  if (loading || !data.resourceMembers) return null;
  const { resourceMembers } = data.resourceMembers;
  const participants = (resourceMembers || []).map(p => p.user);

  const handleAddMember = user => {
    addMember({
      variables: {
        resourceType,
        id: resourceId,
        input: {
          userId: user.id,
          accessType: DEFAULT_ACCESS_TYPE,
        },
      },
    });

    localAddMember({
      variables: {
        resourceType,
        id: resourceId,
        user,
        accessType: DEFAULT_ACCESS_TYPE,
      },
    });
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen}>
      <Header onClick={handleHideDropdown}>
        {`Share this ${documentId ? 'Document' : 'Discussion'}`}
      </Header>
      <Contents onClick={handleHideDropdown}>
        <StyledOrganizationSearch
          isModalOpen={isOpen}
          isDropdownVisible={isDropdownVisible}
          currentMembers={participants}
          handleAddMember={handleAddMember}
          handleShowDropdown={handleShowDropdown}
          handleHideDropdown={handleHideDropdown}
          handleCloseModal={handleClose}
        />
        <ParticipantsList />
      </Contents>
    </StyledModal>
  );
};

ResourceAccessModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ResourceAccessModal;
