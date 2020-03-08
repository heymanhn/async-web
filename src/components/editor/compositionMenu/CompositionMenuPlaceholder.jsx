import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useSelectionDimensions from 'utils/hooks/useSelectionDimensions';

import ContentPlaceholder from 'components/editor/ContentPlaceholder';

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
  ({ isVisible, styles }) => {
    if (!isVisible || !styles) return {};
    return { opacity: 1, ...styles };
  }
);

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
    <Container styles={adjustedCoords()} isVisible={isVisible}>
      <ContentPlaceholder />
    </Container>
  );
};

CompositionMenuPlaceholder.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default CompositionMenuPlaceholder;
