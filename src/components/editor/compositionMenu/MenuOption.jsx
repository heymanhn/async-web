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

const MenuOption = ({ handleClick, icon, selectedOption, title, ...props }) => {
  const optionRef = useRef(null);

  useEffect(() => {
    if (selectedOption === title) {
      // the options argument is not supported in IE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      //
      // NOTE (HN): In the future when we have the menu showing up in either direction,
      // we can support aligning the scroll to the bottom or top.
      optionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedOption, title]);

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
  handleClick: PropTypes.func.isRequired,
  icon: PropTypes.object.isRequired,
  selectedOption: PropTypes.string,
  title: PropTypes.string.isRequired,
};

MenuOption.defaultProps = {
  selectedOption: null,
};

export default MenuOption;
