import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ isSelected, theme: { colors } }) => ({
  background: isSelected ? colors.grey7 : 'initial',
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

const MenuOption = ({
  afterOptionInvoked,
  handleInvoke,
  icon,
  optionToInvoke,
  selectedOption,
  title,
  ...props
}) => {
  const optionRef = useRef(null);

  useEffect(() => {
    if (selectedOption === title) {
      // the options argument is not supported in IE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      optionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedOption, title]);

  function handleAction(event) {
    if (event) event.preventDefault();
    handleInvoke();
    return afterOptionInvoked();
  }

  // Don't let the toolbar handle the event, so that it won't reset its visibility
  function handleMouseDown(event) {
    event.preventDefault();
  }

  if (optionToInvoke === title) handleAction();

  return (
    <Container
      isSelected={selectedOption === title}
      onClick={handleAction}
      onMouseDown={handleMouseDown}
      onKeyDown={handleAction}
      ref={optionRef}
      {...props}
    >
      <IconContainer>{icon}</IconContainer>
      <Title>{title}</Title>
    </Container>
  );
};

MenuOption.propTypes = {
  afterOptionInvoked: PropTypes.func.isRequired,
  handleInvoke: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  optionToInvoke: PropTypes.string,
  selectedOption: PropTypes.string,
  title: PropTypes.string.isRequired,
};

MenuOption.defaultProps = {
  optionToInvoke: null,
  selectedOption: null,
};

export default MenuOption;
