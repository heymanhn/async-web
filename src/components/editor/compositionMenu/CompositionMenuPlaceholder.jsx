import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ContentPlaceholder from 'components/editor/ContentPlaceholder';

const Container = styled.div(
  ({ isVisible, theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 16 }),

    display: isVisible ? 'block' : 'none',
    color: colors.textPlaceholder,
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

const CompositionMenuPlaceholder = ({ isVisible, coords }) => {
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
  coords: PropTypes.object,
};

CompositionMenuPlaceholder.defaultProps = {
  coords: {},
};

export default CompositionMenuPlaceholder;
