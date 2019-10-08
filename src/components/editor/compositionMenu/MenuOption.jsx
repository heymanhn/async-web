import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '32px',
  width: '100%',
  margin: 0,

  ':hover': {
    background: colors.grey7,
  },
}));

const IconContainer = styled.div({
  flexShrink: 0,
  marginLeft: '20px',
  width: '35px',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontWeight: 500,
  fontSize: '14px',
  marginTop: '-2px',
}));

const MenuOption = ({ handleClick, icon, title, ...props }) => {
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
      <IconContainer>{icon}</IconContainer>
      <Title>{title}</Title>
    </Container>
  );
};

MenuOption.propTypes = {
  handleClick: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default MenuOption;
