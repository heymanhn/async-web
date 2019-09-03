import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import AddReactionButton from './AddReactionButton';
import MessageDropdown from './MessageDropdown';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  height: '32px',
  opacity: isOpen ? 1 : 0,
  transition: 'opacity 0.1s',
}));

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  color: colors.grey4,
  padding: '0px 10px',

  ':hover': {
    color: colors.grey3,
  },
}));

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: '100%',
  margin: '0px',
}));

const MenuIcon = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '1px',
  marginTop: '-1px',
});

const HoverMenu = ({
  conversationId,
  isOpen,
  messageId,
  ...props
}) => {
  const [isPickerOpen, setPickerState] = useState(false);
  const [isDropdownOpen, setDropdownState] = useState(false);
  function showDropdown() { setDropdownState(true); }
  function closeDropdown() { setDropdownState(false); }
  const shouldDisplay = isOpen || isPickerOpen || isDropdownOpen;

  return (
    <Container isOpen={shouldDisplay} {...props}>
      <ButtonContainer>
        <AddReactionButton
          conversationId={conversationId}
          messageId={messageId}
          onPickerStateChange={setPickerState}
          placement="below"
        />
      </ButtonContainer>
      <VerticalDivider />
      <ButtonContainer onClick={showDropdown}>
        <MenuIcon>
          •••
        </MenuIcon>
        <MessageDropdown
          handleClose={closeDropdown}
          isOpen={isDropdownOpen}
        />
      </ButtonContainer>
    </Container>
  );
};

HoverMenu.propTypes = {
  conversationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired,
};

export default HoverMenu;
