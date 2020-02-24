import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledSpinner = styled(Spinner)(({ color, size, theme: { colors } }) => ({
  border: `.08em solid ${colors[color]}`,
  borderRightColor: 'transparent',
  width: `${size}px`,
  height: `${size}px`,
}));

const LoadingIndicator = ({ color, size, ...props }) => (
  <Container {...props}>
    <StyledSpinner color={color} size={size} />
  </Container>
);

LoadingIndicator.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  color: 'blue',
  size: '20',
};

export default LoadingIndicator;
