import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import NotificationsDropdown from 'components/notifications/NotificationsDropdown';

const DROPDOWN_WIDTH = 400;

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

const Label = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey1,
  marginTop: '1px',
}));

const StyledNotificationsDropdown = styled(NotificationsDropdown)({});

const AllUpdatesButton = () => {
  const buttonRef = useRef(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleCloseDropdown = () => setIsDropdownVisible(false);

  const [coords, setCoords] = useState({});
  const calculatePosition = () => {
    if (!isDropdownVisible || !buttonRef.current) {
      if (Object.keys(coords).length) setCoords({});
      return;
    }

    const { offsetLeft, offsetTop, offsetWidth } = buttonRef.current;

    const newCoords = {
      top: `${offsetTop - 5}px`,
      left: `${offsetLeft + offsetWidth - 5}px`,
    };

    if (coords.top === newCoords.top && coords.left === newCoords.left) return;
    setCoords(newCoords);
  };

  useEffect(() => {
    calculatePosition();

    window.addEventListener('resize', calculatePosition);
    return () => {
      window.removeEventListener('resize', calculatePosition);
    };
  });

  return (
    <Container>
      <ButtonContainer onClick={handleShowDropdown} ref={buttonRef}>
        <IconContainer>
          <StyledIcon icon="bell" />
        </IconContainer>
        <Label>All Updates</Label>
      </ButtonContainer>
      <StyledNotificationsDropdown
        coords={coords}
        isOpen={isDropdownVisible}
        handleClose={handleCloseDropdown}
        width={DROPDOWN_WIDTH}
      />
    </Container>
  );
};

export default AllUpdatesButton;
