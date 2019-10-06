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
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  width: '30px',
  height: '30px',

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

  const rect = range.getBoundingClientRect();
  console.dir(rect);

  return (
    <>
      <ButtonContainer
        isVisible={isButtonVisible && isEmptyParagraph}
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
  range: PropTypes.object.isRequired,
};

CompositionMenuButton.defaultProps = {
  query: '',
};

export default CompositionMenuButton;
