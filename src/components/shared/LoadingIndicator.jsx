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

const StyledSpinner = styled(Spinner)(({ color, theme: { colors } }) => ({
  border: `.05em solid ${colors[color]}`,
  borderRightColor: 'transparent',
  width: '20px',
  height: '20px',
}));

const LoadingIndicator = ({ color, ...props }) => (
  <Container {...props}>
    <StyledSpinner color={color} />
  </Container>
);

LoadingIndicator.propTypes = {
  color: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  color: 'blue',
};

export default LoadingIndicator;
