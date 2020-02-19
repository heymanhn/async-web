import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import ReactionPicker from './ReactionPicker';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ButtonContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.grey4,

  ':hover': {
    color: colors.grey3,
  },
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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isOutsideClick, setIsOutsideClick] = useState(false);

  function handlePickerChange(newState) {
    if (isPickerOpen !== newState) {
      onPickerStateChange(newState);
      setIsPickerOpen(newState);
    }
  }
  function handleOpenPicker() {
    if (isOutsideClick) {
      setIsOutsideClick(false);
      return;
    }
    handlePickerChange(true);
  }
  function handleClosePicker({ outsideClick } = {}) {
    if (outsideClick) {
      setIsOutsideClick(true);

      // Hack to make sure the outsideClick state is only used for
      // not re-opening the picker when the user clicks on the add reaction button
      setTimeout(() => setIsOutsideClick(false), 300);
    }
    handlePickerChange(false);
  }

  return (
    <Container {...props}>
      <ButtonContainer onClick={handleOpenPicker}>
        <StyledIcon icon="laugh" />
        <PlusSign>+</PlusSign>
      </ButtonContainer>
      <ReactionPicker
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
