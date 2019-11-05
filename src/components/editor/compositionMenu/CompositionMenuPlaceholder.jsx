import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ isVisible, theme: { colors } }) => ({
  display: isVisible ? 'block' : 'none',
  color: colors.textPlaceholder,
  fontSize: '16px',
  opacity: 0,
  top: '-10000px',
  left: '-10000px',
  position: 'absolute',
  pointerEvents: 'none',
}), ({ coords, isVisible }) => {
  if (!isVisible || !coords) return {};

  const { top, left } = coords;
  return { opacity: 1, top, left };
});

const SlashKey = styled.span(({ theme: { colors } }) => ({
  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '3px',
  margin: '0 4px',
  padding: '2px 6px',
}));

const CompositionMenuPlaceholder = ({ isVisible }) => {
  const [coords, setCoords] = useState(null);

  function updatePlaceholderPosition() {
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const newCoords = {
      top: `${rect.top + window.pageYOffset - 3}px`, // Vertically aligning the placeholder
      left: `${rect.left + window.pageXOffset + 2}px`, // Some breathing room after the cursor
    };

    if (coords && newCoords.top === coords.top && newCoords.left === coords.left) return;

    if (!isVisible) {
      newCoords.top = -10000;
      newCoords.left = -10000;
    }

    setCoords(newCoords);
  }

  setTimeout(updatePlaceholderPosition, 0);

  return (
    <Container coords={coords} isVisible={isVisible}>
      Type
      <SlashKey>/</SlashKey>
      for options
    </Container>
  );
};

CompositionMenuPlaceholder.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default CompositionMenuPlaceholder;
