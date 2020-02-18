/* eslint no-alert: 0 */
import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';
import { MessageContext } from 'utils/contexts';

import useDiscussionMutations from './useDiscussionMutations';
import useMessageMutations from './useMessageMutations';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: `0px 0px 8px ${colors.borderGrey}`,
  position: 'absolute',
  right: '-1px',
  top: '-1px',
  zIndex: 100,
}));

const DropdownOption = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  padding: '12px 20px',

  ':hover': {
    background: colors.formGrey,
  },
  ':first-of-type': {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  ':last-of-type': {
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
}));

const IconContainer = styled.div({
  width: '18px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '16px',
  width: '18px', // Setting this for now...
}));

const OptionName = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  marginLeft: '12px',
  position: 'relative',
  top: '1px',
}));

const MessageDropdown = ({ handleCloseDropdown, isOpen, ...props }) => {
  const selector = useRef();
  const { threadPosition, setMode } = useContext(MessageContext);
  const { handleDelete: handleDeleteDiscussion } = useDiscussionMutations();
  const { handleDelete: handleDeleteMessage } = useMessageMutations();

  function handleClickOutside() {
    if (!isOpen) return;
    handleCloseDropdown();
  }
  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  // If the user is deleting the first message of a discussion, ask if they
  // want to delete the whole discussion.
  function handleDeleteWrapper(event) {
    event.stopPropagation();

    const resource = threadPosition ? 'message' : 'discussion';
    const handleDelete = threadPosition
      ? handleDeleteMessage
      : handleDeleteDiscussion;

    const userChoice = window.confirm(
      `Are you sure you want to delete this ${resource}?`
    );

    if (!userChoice) return;

    handleCloseDropdown();
    handleDelete();
  }

  function handleEdit(event) {
    event.stopPropagation();
    handleCloseDropdown();
    setMode('edit');
  }

  return (
    <Container isOpen={isOpen} ref={selector} {...props}>
      <DropdownOption onClick={handleEdit}>
        <IconContainer>
          <StyledIcon icon={faEdit} />
        </IconContainer>
        <OptionName>Edit</OptionName>
      </DropdownOption>
      <DropdownOption onClick={handleDeleteWrapper}>
        <IconContainer>
          <StyledIcon icon={faTrash} />
        </IconContainer>
        <OptionName>
          {threadPosition ? 'Delete' : 'Delete Discussion'}
        </OptionName>
      </DropdownOption>
    </Container>
  );
};

MessageDropdown.propTypes = {
  handleCloseDropdown: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default MessageDropdown;
