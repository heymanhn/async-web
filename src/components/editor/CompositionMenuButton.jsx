import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import styled from '@emotion/styled';

import CompositionMenu from './CompositionMenu';

const ButtonContainer = styled.div(({ isVisible, theme: { colors } }) => ({
  display: isVisible ? 'flex' : 'none',
  justifyContent: 'center',
  alignItems: 'center',
  top: '-10000px',
  left: '-10000px',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  opacity: 0,
  transition: 'opacity 0.1s',
  width: '30px',
  height: '30px',
  position: 'absolute',

  ':hover': {
    background: colors.formGrey,
  },
}), ({ coords, isVisible }) => {
  if (!isVisible || !coords) return {};

  const { top, left } = coords;
  return { opacity: 1, top, left };
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const CompositionMenuButton = ({ isEmptyParagraph, query, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coords, setCoords] = useState(null);

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }
  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function updateButtonPosition() {
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const newCoords = {
      top: `${rect.top + window.pageYOffset - 7}px`, // 7px is half of 15px button height
      left: `${rect.left + window.pageXOffset - 45}px`, // 30px margin + half of 30px width
    };

    if (coords && newCoords.top === coords.top && newCoords.left === coords.left) return;

    setCoords(newCoords);
  }

  const showButton = !isMenuOpen && isEmptyParagraph;
  if (showButton) {
    setTimeout(updateButtonPosition, 0);
  }
  if (!showButton && coords) setCoords(null);

  return (
    <>
      <ButtonContainer
        coords={coords}
        isVisible={showButton}
        onClick={handleOpenMenu}
        {...props}
      >
        <StyledIcon icon={faPlus} />
      </ButtonContainer>
      <CompositionMenu
        handleClose={handleCloseMenu}
        isOpen={isMenuOpen}
      />
    </>
  );
};

CompositionMenuButton.propTypes = {
  isEmptyParagraph: PropTypes.bool.isRequired,
  query: PropTypes.string,
  range: PropTypes.object,
};

CompositionMenuButton.defaultProps = {
  query: '',
  range: null,
};

export default CompositionMenuButton;
