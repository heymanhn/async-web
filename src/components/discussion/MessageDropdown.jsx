import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';
import { MessageContext } from 'utils/contexts';

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

const MessageDropdown = ({ handleClose, isOpen, ...props }) => {
  const selector = useRef();
  const { setMode } = useContext(MessageContext);
  const { handleDelete } = useMessageMutations();

  function handleClickOutside() {
    if (!isOpen) return;
    handleClose();
  }
  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  function handleDeleteWrapper(event) {
    event.stopPropagation();
    handleClose();
    handleDelete();
  }

  function handleEdit(event) {
    event.stopPropagation();
    handleClose();
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
        <OptionName>Delete</OptionName>
      </DropdownOption>
    </Container>
  );
};

MessageDropdown.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default MessageDropdown;
