import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { titleize } from 'utils/helpers';

import Modal from 'components/shared/Modal';
import InputWithIcon from 'components/shared/InputWithIcon';
import ParticipantsList from 'components/participants/ParticipantsList';

// import OrganizationMemberSearch from './OrganizationMemberSearch';

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
  paddingBottom: '20px',
});

const ResourceCreationModal = ({ resourceType, handleClose, isOpen }) => {
  // Putting the state here so that clicking anywhere on the modal
  // dismisses the dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleHideDropdown = () => setIsDropdownVisible(false);

  const [title, setTitle] = useState('');

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen}>
      <Header onClick={handleHideDropdown}>
        <Title>{`New ${titleize(resourceType)}`}</Title>
        <CloseIcon icon={['far', 'times']} onClick={handleClose} />
      </Header>
      <Contents onClick={handleHideDropdown}>
        <InputWithIcon
          icon={ICON_FOR_RESOURCE_TYPE[resourceType]}
          placeholder="Give it a name"
          value={title}
          setValue={setTitle}
        />
        {/* // People picker // participants list // Create Button */}
        <ParticipantsList />
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
