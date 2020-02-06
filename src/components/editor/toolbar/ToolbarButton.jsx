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

const ToolbarButton = ({ children, handleClick, ...props }) => {
  function handleAction(event) {
    event.preventDefault();
    return handleClick();
  }

  // Don't let the toolbar handle the event, so that it won't reset its visibility
  function handleMouseDown(event) {
    event.preventDefault();
  }

  return (
    <Container
      onClick={handleAction}
      onMouseDown={handleMouseDown}
      onKeyDown={handleAction}
      {...props}
    >
      {children}
    </Container>
  );
};

ToolbarButton.propTypes = {
  children: PropTypes.node.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ToolbarButton;
