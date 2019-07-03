import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const Container = styled.div(({ enabled, number, theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  color: enabled ? colors.selectedValueBlue : colors.bgGrey,
  cursor: 'pointer',
  fontSize: number === 2 ? '12px' : 'initial',
  margin: '5px 10px',

  position: number === 2 ? 'relative' : 'initial',
  top: number === 2 ? '2px' : '0',

  ':hover': {
    color: colors.selectedValueBlue,
  },
}));

const NumberDisplay = styled.span(({ number }) => ({
  fontSize: '10px',
  fontWeight: 600,

  position: 'relative',
  top: number === 1 ? '3px' : '1px',
  left: '1px',
}));

const CustomHeadingIcon = ({ number, ...props }) => (
  <Container number={number} {...props}>
    <FontAwesomeIcon icon={faHeading} />
    <NumberDisplay number={number}>{number}</NumberDisplay>
  </Container>
);

CustomHeadingIcon.propTypes = {
  number: PropTypes.number.isRequired,
};

export default CustomHeadingIcon;
