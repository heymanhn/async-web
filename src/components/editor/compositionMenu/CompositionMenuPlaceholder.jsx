import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useSelectionDimensions from 'utils/hooks/useSelectionDimensions';

const Container = styled.div(
  ({ isVisible, theme: { colors } }) => ({
    display: isVisible ? 'block' : 'none',
    color: colors.textPlaceholder,
    fontSize: '16px',
    opacity: 0,
    top: '-10000px',
    left: '-10000px',
    position: 'absolute',
    pointerEvents: 'none',
  }),
  ({ coords, isVisible }) => {
    if (!isVisible || !coords) return {};

    const { top, left } = coords;
    return { opacity: 1, top, left };
  }
);

const SlashKey = styled.span(({ theme: { colors } }) => ({
  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '3px',
  margin: '0 4px',
  padding: '2px 6px',
}));

const CompositionMenuPlaceholder = ({ isVisible }) => {
  const { coords } = useSelectionDimensions({ skip: !isVisible });

  const adjustedCoords = () => {
    if (!isVisible || !coords) return null;

    const { top, left } = coords;
    return {
      top: `${top - 3}px`, // Vertically aligning the placeholder
      left: `${left + 2}px`, // Some breathing room after the cursor
    };
  };

  return (
    <Container coords={adjustedCoords()} isVisible={isVisible}>
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
