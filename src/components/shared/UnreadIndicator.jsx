import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Circle = styled.div(({ diameter, theme: { colors } }) => ({
  background: colors.altBlue,
  borderRadius: '50%',
  width: `${diameter}px`,
  height: `${diameter}px`,
}));

const UnreadIndicator = ({ diameter, ...props }) => (
  <Circle diameter={diameter} {...props} />
);

UnreadIndicator.propTypes = {
  diameter: PropTypes.number.isRequired,
};

export default UnreadIndicator;
