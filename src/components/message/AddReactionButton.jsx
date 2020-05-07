import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import ReactionPicker from './ReactionPicker';

const Container = styled.div();

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.grey3,
}));

const StyledIcon = styled(FontAwesomeIcon)({
  cursor: 'pointer',
  fontSize: '16px',
});

const PlusSign = styled.div({
  fontSize: '16px',
  fontWeight: 500,
  marginLeft: '2px',
  marginTop: '-4px',
});

const AddReactionButton = ({ onPickerStateChange, placement, ...props }) => {
  const buttonRef = useRef(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isOutsideClick, setIsOutsideClick] = useState(false);

  const handlePickerChange = newState => {
    if (isPickerOpen === newState) return;

    onPickerStateChange(newState);
    setIsPickerOpen(newState);
  };

  const handleOpenPicker = () => {
    if (isOutsideClick) {
      setIsOutsideClick(false);
      return;
    }

    handlePickerChange(true);
  };

  const handleClosePicker = ({ outsideClick } = {}) => {
    if (outsideClick) {
      setIsOutsideClick(true);

      // Hack to make sure the outsideClick state is only used for
      // not re-opening the picker when the user clicks on the add reaction button
      setTimeout(() => setIsOutsideClick(false), 300);
    }

    handlePickerChange(false);
  };

  return (
    <Container ref={buttonRef} {...props}>
      <ButtonContainer onClick={handleOpenPicker}>
        <StyledIcon icon={['far', 'laugh']} />
        <PlusSign>+</PlusSign>
      </ButtonContainer>
      <ReactionPicker
        buttonRef={buttonRef}
        handleClose={handleClosePicker}
        isOpen={isPickerOpen}
        placement={placement}
      />
    </Container>
  );
};

AddReactionButton.propTypes = {
  onPickerStateChange: PropTypes.func,
  placement: PropTypes.oneOf(['above', 'below']).isRequired,
};

AddReactionButton.defaultProps = {
  onPickerStateChange: () => {},
};

export default AddReactionButton;
