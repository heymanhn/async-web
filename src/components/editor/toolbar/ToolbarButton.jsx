import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
});

const ToolbarButton = ({ children, ...props }) => (
  <Container {...props}>
    {children}
  </Container>
);

ToolbarButton.propTypes = {
  children: PropTypes.object.isRequired,
};

export default ToolbarButton;
