import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import styled from '@emotion/styled';

import CompositionMenu from './CompositionMenu';

const ButtonContainer = styled.div(({ isVisible, rect, theme: { colors } }) => ({
  display: isVisible ? 'flex' : 'none',
  justifyContent: 'center',
  alignItems: 'center',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  width: '30px',
  height: '30px',
  position: 'absolute',
  top: `${rect.top + window.pageYOffset - 7}px`, // 7px is half of 15px button height
  left: `${rect.left + window.pageXOffset - 45}px`, // 30px margin + half of 30px width

  ':hover': {
    background: colors.formGrey,
  },
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const CompositionMenuButton = ({ isEmptyParagraph, query, range, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  function handleOpenMenu() {
    setIsMenuOpen(true);
    setIsButtonVisible(false);
  }
  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  if (!range) return null;
  const rect = range.getBoundingClientRect();

  return (
    <>
      <ButtonContainer
        isVisible={isButtonVisible && isEmptyParagraph}
        onClick={handleOpenMenu}
        rect={rect}
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
