import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { DiscussionContext, ThreadContext } from 'utils/contexts';

import AddReactionButton from './AddReactionButton';
import MessageDropdown from './MessageDropdown';
import StartMessageThreadButton from './StartMessageThreadButton';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
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

  color: colors.grey3,
  padding: '0px 10px',
  height: '100%',

  ':hover': {
    color: colors.grey3,
  },
}));

const MenuButtonContainer = styled(ButtonContainer)({
  position: 'relative',
});

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

const HoverMenu = ({ isAuthor, isOpen, ...props }) => {
  const [isPickerOpen, setPickerState] = useState(false);
  const [isDropdownOpen, setDropdownState] = useState(false);
  const showDropdown = () => setDropdownState(true);
  const closeDropdown = () => setDropdownState(false);
  const { threadId } = useContext(ThreadContext);
  const { handleShowThread } = useContext(DiscussionContext);

  const shouldDisplay = isOpen || isPickerOpen || isDropdownOpen;

  return (
    <Container isOpen={shouldDisplay} {...props}>
      <ButtonContainer>
        <AddReactionButton
          onPickerStateChange={setPickerState}
          placement="below"
        />
      </ButtonContainer>
      {!threadId && (
        <>
          <VerticalDivider />
          <ButtonContainer>
            <StartMessageThreadButton handleShowThread={handleShowThread} />
          </ButtonContainer>
        </>
      )}
      {isAuthor && (
        <>
          <VerticalDivider />
          <MenuButtonContainer onClick={showDropdown}>
            <MenuIcon>•••</MenuIcon>
            <MessageDropdown
              handleCloseDropdown={closeDropdown}
              isOpen={isDropdownOpen}
            />
          </MenuButtonContainer>
        </>
      )}
    </Container>
  );
};

HoverMenu.propTypes = {
  isAuthor: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default HoverMenu;
