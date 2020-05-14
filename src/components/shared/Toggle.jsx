import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ isEnabled, theme: { colors } }) => ({
  background: isEnabled ? colors.altBlue : colors.grey6,
  borderRadius: '30px',
  cursor: 'pointer',
  height: '30px',
  width: '54px',
  transition: '0.4s',
}));

const Slider = styled.div(({ isEnabled, theme: { colors } }) => ({
  background: colors.white,
  borderRadius: '30px',
  height: '20px',
  width: '20px',
  margin: '5px',
  marginLeft: isEnabled ? '29px' : '5px',
  transition: '0.4s',
}));

const Toggle = ({ isEnabled, handleToggle, ...props }) => {
  return (
    <Container isEnabled={isEnabled} onClick={handleToggle} {...props}>
      <Slider isEnabled={isEnabled} />
    </Container>
  );
};

Toggle.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default Toggle;
