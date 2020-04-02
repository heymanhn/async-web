import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import NotificationsDropdown from 'components/notifications/NotificationsDropdown';

const Container = styled.div({
  display: 'flex',
});

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  cursor: 'pointer',
  marginTop: '15px',
  padding: '8px 20px',
  width: '100%',

  ':hover': {
    background: colors.grey7,
  },
}));

const IconContainer = styled.div({
  width: '40px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '18px',
}));

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  marginTop: '1px',
}));

const StyledNotificationsDropdown = styled(NotificationsDropdown)({});

const AllUpdatesButton = () => {
  const buttonRef = useRef(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleCloseDropdown = () => setIsDropdownVisible(false);

  const calculatePosition = () => {
    if (!isDropdownVisible || !buttonRef.current) return {};

    const { offsetLeft, offsetTop, offsetWidth } = buttonRef.current;

    return {
      top: `${offsetTop - 5}px`,
      left: `${offsetLeft + offsetWidth - 5}px`,
    };
  };

  return (
    <Container>
      <ButtonContainer onClick={handleShowDropdown} ref={buttonRef}>
        <IconContainer>
          <StyledIcon icon="bell" />
        </IconContainer>
        <Label>All Updates</Label>
      </ButtonContainer>
      <StyledNotificationsDropdown
        coords={calculatePosition()}
        isOpen={isDropdownVisible}
        handleClose={handleCloseDropdown}
      />
    </Container>
  );
};

export default AllUpdatesButton;
